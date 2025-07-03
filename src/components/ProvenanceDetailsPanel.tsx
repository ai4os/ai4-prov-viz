import { useMemo, useState } from "react";
import { downloadDetailsFile } from "../services/file-downloader.service";
import { cn } from "../utils/cn";
import { useDetailsPanelStore } from "../zustand/detailspanel.store";
import { getNodeToRelations } from "../scripts/init/init";
import type { Backend } from "../scripts/types/provenance";
import {
  findProvIcon,
  isObjectEmpty,
  miniIRI,
  ruleToHReadable,
} from "../scripts/utils/utils";
import Tippy from "@tippyjs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useGroupNodes } from "./hooks/useGroupNodes";
import { Heap } from "heap-js";
import type { ComparableNode } from "../utils/node-grouping";

const ACCORDIONCOLORS = ["#0953CC", "#1E6FF5", "#629BF8"];
const calcAccordionColor = (colorIndex: number) =>
  ACCORDIONCOLORS[colorIndex % ACCORDIONCOLORS.length];

export function ProvenanceDetailsPanel() {
  const { node, setNode } = useDetailsPanelStore();

  const { tag } = useMemo(() => {
    if (!node) return {};
    return {
      tag: node.tag,
    };
  }, [node]);

  const directForwardRelations = useMemo(() => {
    if (!node) return null;
    return getNodeToRelations(node);
  }, [node]);

  console.log("relations: ", directForwardRelations);
  // hidden will be toggeable probably
  return (
    <div
      className={cn(
        "w-[35vw] absolute top-3 end-3 font-mono",
        node ? "block" : "hidden"
      )}
    >
      <div
        className={cn(
          "flex flex-col overflow-y-scroll",
          "rounded-md w-full max-h-[95vh] no-scrollbar gap-2",
          "p-1 pl-2 pt-2 pb-3 bg-slate-700/30 font-semibold"
        )}
      >
        <div className="flex flex-col gap-1 p-0">
          <div className="flex justify-between pr-2">
            <span
              className={cn(
                "font-mono text-sm text-ellipsis overflow-y-clip",
                "font-semibold text-xl text-white"
              )}
            >
              {tag}
            </span>
            <button
              type="button"
              style={{
                color: "#fff",
                cursor: "pointer",
                background: "none",
                border: "none",
                padding: 0,
              }}
              aria-label="Close details panel"
              onClick={() => {
                setNode(undefined);
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <DownloadAppMetadataButtons nodeTag={tag} />
        </div>
        <LinkPanelList
          relations={directForwardRelations ?? undefined}
          colorIndex={0}
        />
      </div>
    </div>
  );
}

const DownloadAppMetadataButtons = ({ nodeTag }: { nodeTag?: string }) => {
  const isAnAppNode = useMemo(() => {
    if (!nodeTag) return false;
    return /\(app\).*/.test(nodeTag);
  }, [nodeTag]);
  if (!isAnAppNode) return null;
  return (
    <div className="flex justify-start gap-2 pr-2">
      <button
        className="details-downloader-button"
        onClick={async () => {
          await downloadDetailsFile(false, `${nodeTag}-deepHybrid.json`);
        }}
      >
        <FontAwesomeIcon icon={["fas", "file-arrow-down"]} />
      </button>
      <button
        className="details-downloader-button"
        onClick={async () => {
          await downloadDetailsFile(true, `${nodeTag}-fair4ml.json`);
        }}
      >
        <img
          src="/icons/fair4ml.png"
          alt="fair4ml icon"
          className="object-contain"
        />
      </button>
    </div>
  );
};

const LinkPanelList = ({
  relations,
  colorIndex,
}: { relations?: Backend.Relations } & ColorIndexed) => {
  if (!relations) return null;
  return (
    <>
      {Object.entries(relations).map(([link, nodes]) => (
        <LinkPanel
          key={link}
          link={link}
          nodes={nodes}
          colorIndex={colorIndex}
        />
      ))}
    </>
  );
};
interface ColorIndexed {
  colorIndex: number;
}

interface LinkPanelProps extends ColorIndexed {
  link: string;
  nodes: Backend.ProvNode[];
}
const LinkPanel = ({ link, nodes, colorIndex }: LinkPanelProps) => {
  const { isolated, grouped } = useGroupNodes(nodes);
  return (
    <div
      className={cn(
        "flex flex-col w-full max-h-[80vh]",
        "gap-1 p-2 rounded-md overflox-x-hidden text-white"
      )}
      style={{
        backgroundColor: calcAccordionColor(colorIndex),
      }}
    >
      <Tippy content={link} placement="left" arrow>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "font-mono text-sm text-ellipsis overflow-y-clip",
            "hover:text-blue-400 hover:cursor-pointer"
          )}
        >
          {ruleToHReadable(miniIRI(link))}
        </a>
      </Tippy>
      <div
        className={cn(
          "flex flex-col w-full max-h-[70vh]",
          "overflow-y-scroll text-black font-normal no-scrollbar gap-1",
          "pl-1 pt-[0.5em] pb-[0.5em] pe-[0.3em]"
        )}
      >
        {Object.entries(grouped).map(([prefix, heap]) => (
          <NodeHeapBlock prefix={prefix} heap={heap} colorIndex={colorIndex} />
        ))}
        {isolated.map((n) => (
          <NodeBlock key={n.id} node={n} colorIndex={colorIndex} />
        ))}
      </div>
    </div>
  );
};

interface NodeHeapBlockProps extends ColorIndexed {
  prefix: string;
  heap: Heap<ComparableNode>;
}
const NodeHeapBlock = ({ prefix, heap, colorIndex }: NodeHeapBlockProps) => {
  return (
    <div className="flex flex-col gap-2 p-1 bg-slate-300">
      <span className="font-mono text-sm">{prefix}</span>
      <div
        className="flex flex-col gap-1"
        style={{ backgroundColor: calcAccordionColor(colorIndex) }}
      >
        {heap.toArray().map((node) => (
          <NodeBlock key={node.id} node={node} colorIndex={colorIndex} />
        ))}
      </div>
    </div>
  );
};
interface NodeBlockProps extends ColorIndexed {
  node: Backend.ProvNode;
}
const NodeBlock = ({ node, colorIndex }: NodeBlockProps) => {
  const [open, setOpen] = useState<boolean>();
  if (node.type === "Literal") return <LiteralNodeBlock node={node} />;

  // Otherwise it is an IRINode !
  const directForwardRelations = getNodeToRelations(node);

  return (
    <div className="flex flex-col gap-2">
      <div
        className={cn(
          "flex flex-row items-center justify-between",
          "p-1 pl-2 pr-2 bg-white rounded-sm",
          "transition-color duration-100",
          "hover:not-focus:bg-slate-200"
        )}
      >
        <div className="flex flex-row gap-2 items-center">
          <img
            className="w-5 h-auto"
            alt="node icon"
            src={findProvIcon(node.type, node.iri)}
          />
          <a
            href={node.iri}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "font-mono text-sm text-ellipsis overflow-y-clip",
              "hover:text-blue-500 cursor-default"
            )}
          >
            {node.tag}
          </a>
          {!isObjectEmpty(directForwardRelations) && (
            <button
              type="button"
              className={cn("transition-all", open && "rotate-90")}
              style={{
                cursor: "pointer",
                background: "none",
                border: "none",
                padding: 0,
              }}
              aria-label="Open/Close the node children list"
              onClick={() => {
                setOpen(!open);
              }}
            >
              <FontAwesomeIcon icon={["fas", "chevron-down"]} />
            </button>
          )}
        </div>
      </div>
      <div
        className={cn(
          "flex flex-col gap-2 max-h-0 overflow-hidden",
          "w-full transition-all duration-300",
          open ? "max-h-screen" : "max-h-0"
        )}
      >
        <LinkPanelList
          relations={directForwardRelations}
          colorIndex={colorIndex + 1}
        />
      </div>
    </div>
  );
};

const LiteralNodeBlock = ({ node }: { node: Backend.LiteralNode }) => {
  const value = useMemo(() => {
    if (node.datatype !== "dateTime") return node.value;
    const d = new Date(isNaN(node.value) ? node.value : Number(node.value))
      .toISOString()
      .split("T");
    return d[0] + " " + d[1].slice(0, -1);
  }, [node]);
  return (
    <div className="flex flex-row bg-white p-1 rounded-sm">
      <span className="font-sans text-base">{value}</span>
    </div>
  );
};
