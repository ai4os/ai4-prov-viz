import type { Provenance } from "../types/provenance";
import type { D3Node, D3IDLink, InitGraph } from "../types/graph";
import { miniIRI } from "../utils/utils";

const processProvenance = (rawprov: Provenance): InitGraph => {
  const prov = pruneProvenance(rawprov);
  const nodes: Record<string, D3Node> = {};
  const links: D3IDLink[] = [];
  // Generate nodes
  Object.values(prov).forEach((node) => {
    nodes[node.iri] = { ...node };
  });

  // Generate links (iterating through relations)
  Object.entries(prov).forEach(([sourceIRI, node]) => {
    Object.entries(node.relations).forEach(([connection, nodeArray]) => {
      nodeArray.forEach((node) => {
        const targetNode = nodes[node.id];
        if (targetNode)
          links.push({
            source: nodes[sourceIRI].id,
            target: targetNode.id,
            label: connection,
            id: `${miniIRI(nodes[sourceIRI].id)}-${miniIRI(targetNode.id)}`,
          });
      });
    });
  });

  return { nodes: Object.values(nodes), links: links };
};

function pruneProvenance(prov: Provenance): Provenance {
  const prunedProv: Provenance = {};
  Object.keys(prov).forEach((k) => {
    if (prov[k].visibility && !prov[k].disabled) prunedProv[k] = { ...prov[k] };
  });
  return prunedProv;
}

export const GraphUtils = { processProvenance };
