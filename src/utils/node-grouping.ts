import type { Backend } from "../scripts/types/provenance";
import { Heap } from "heap-js";

export type ComparableNode = { priority: number } & Backend.ProvNode;
type NodeHeapMap = Record<string, Heap<ComparableNode>>;

type GroupedNodes = {
  grouped: NodeHeapMap;
  isolated: Backend.ProvNode[];
};

export function groupNodes(nodes: Backend.ProvNode[]): GroupedNodes {
  const groupRegex = /(\w+)-(\d+)/;
  const heapComparator = (a: ComparableNode, b: ComparableNode) =>
    a.priority - b.priority;

  const grouped: NodeHeapMap = {};
  const isolated: Backend.ProvNode[] = [];
  nodes.forEach((node) => {
    if (!("tag" in node)) {
      isolated.push(node);
      return;
    }
    const match = node.tag.match(groupRegex);
    if (!match) {
      isolated.push(node);
      return;
    }
    const [_, prefix, priority] = match;
    // Push it to Node Heap Map
    if (!(prefix in grouped)) {
      grouped[prefix] = new Heap(heapComparator);
    }
    grouped[prefix].push({ priority: Number(priority), ...node });
  });

  return {
    grouped,
    isolated,
  };
}
