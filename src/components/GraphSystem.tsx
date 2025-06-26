import { useEffect } from "react";
import { ProvenanceDateLabel } from "./ProvenanceDateLabel";
import { ProvenanceDetailsPanel } from "./ProvenanceDetailsPanel";
import { ProvenanceChatContainer } from "./ProvenanceChat";
import { initD3Graph } from "../scripts/init/init";

export function GraphSystem() {
  useEffect(() => {
    const asyncGraphCreation = async () => {
      const container = document.getElementById("container")!;
      await initD3Graph(container);
    };
    asyncGraphCreation();
  }, []);
  return (
    <>
      <ProvenanceDetailsPanel />
      <ProvenanceDateLabel />
      <ProvenanceChatContainer />
    </>
  );
}
