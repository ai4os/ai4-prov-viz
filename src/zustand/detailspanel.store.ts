import { create } from "zustand";
import type { D3Node } from "../scripts/types/graph";
type DetailsPanelState = {
  node?: D3Node; // Type Node
  setNode(node?: D3Node): void;
};

export const useDetailsPanelStore = create<DetailsPanelState>((set) => ({
  node: undefined,
  setNode(node) {
    set({ node });
  }
}));
