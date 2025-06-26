import { useEffect } from "react";
import { GraphSystem } from "../../components/GraphSystem";
import { initFontAwesomeIcons } from "../../core/config/font-awesome-icons";

export function GraphPage() {
  useEffect(() => {
    initFontAwesomeIcons();
  }, []);
  return (
    <div id="container">
      <GraphSystem />
    </div>
  );
}
