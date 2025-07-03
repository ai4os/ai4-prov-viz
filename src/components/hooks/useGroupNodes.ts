import { useMemo } from "react";
import type { Backend } from "../../scripts/types/provenance";
import { groupNodes } from "../../utils/node-grouping";

export function useGroupNodes(nodes: Backend.ProvNode[]) {
    return useMemo(() => {
        return groupNodes(nodes);
    },[nodes])
}