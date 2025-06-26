import { ProvenanceService } from "../../services/provenance.service";
import type { D3Link, D3Node } from "../types/graph";
import { GraphUtils } from "./preprocess";
import { createD3Graph } from "../d3-graph/graph";
import type { Provenance, Backend } from "../types/provenance";

let provenance: Provenance; // TODO: probably will be better to treat this as a global variable
let graph: any;
let completeGraphVisible: boolean = false;
let loaded: boolean = false;
const updateGraph = () => {
  const { nodes, links } = GraphUtils.processProvenance(provenance);
  graph.update({ nodes, links });
};

const onNodeClick = (event: MouseEvent, d: D3Node) => {
  // Prevent dragging to avoid simulation recalc?
  event.preventDefault();
  if (completeGraphVisible) return;
  Object.entries(provenance).forEach(([k, o]) => {
    // Enables nodes who points to this node but not the ones that the source node points to
    provenance[k].visibility = true;
  });
  updateGraph();
  completeGraphVisible = true;
};

const onLinkClick = (event: MouseEvent, d: D3Link) => {
  console.log("link click");
};

export const getNodeToRelations = (d: Backend.ProvNode): Backend.Relations => {
  if (!d) return {};
  const nodeKey = Object.keys(provenance).find((n) => n == d.id)!;
  const toChildren: Backend.Relations = { ...provenance[nodeKey].relations };
  return toChildren;
};

const initgraph = async (container: HTMLElement) => {
  const rawprovenance = await new ProvenanceService().getProvenance();
  provenance = rawprovenance;
  const { nodes, links } = GraphUtils.processProvenance(rawprovenance);
  graph = createD3Graph(container, nodes, links, onNodeClick, onLinkClick);
  graph.update({ nodes, links });
};

export const initD3Graph = async (container: HTMLElement) => {
  if (loaded) return;
  loaded = true;
  await initgraph(container);
};
