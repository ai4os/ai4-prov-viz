import * as d3 from "d3";
import type { D3Node } from "../types/graph";
import { findProvIcon } from "../utils/utils";
import { useDetailsPanelStore } from "../../zustand/detailspanel.store";

export function Render() {
  // d -> D3Node
  const plusIconOnClickHandler = (event: MouseEvent, d: any) =>
    useDetailsPanelStore.getState().setNode(d);

  const addMoreDetailsIcon = (gElem: any, x: number, y: number) => {
    // + circle
    gElem
      .append("circle")
      .attr("r", 3.5)
      .attr("transform", `translate(${x - 5}, ${y - 2})`)
      .attr("fill", "#fff")
      .on("click", plusIconOnClickHandler);

    // + symbol
    gElem
      .append("image")
      .style("pointer-events", "none")
      .attr("height", 4)
      .attr("width", 4)
      .attr("transform", `translate(${x - 7}, ${y - 4})`)
      .attr("href", "/icons/plusIcon.svg");
  };

  const renderAgent = (_selector: SVGGElement, d: D3Node): void => {
    const gSVG = d3.select(_selector);
    // Instantatiate yellow circle with shadow filter
    gSVG
      .append("circle")
      .attr("r", 15)
      .attr("fill", "#fffac9")
      .attr("class", "shadowed");

    // Logo
    gSVG
      .append("image")
      .attr("height", 26)
      .attr("width", 19.5)
      .attr("transform", "translate(-10,-13)")
      .attr("href", findProvIcon(d.type, d.id));

    // Labeling
    gSVG
      .append("text")
      .attr("class", "font-mono")
      .attr("fill", "#000")
      .attr("font-size", "5px")
      .attr("text-anchor", "middle")
      .attr("y", "20px")
      .html(d.tag);

    addMoreDetailsIcon(gSVG, 20.8, -10.8);
  };

  const renderEntity = (_selector: SVGGElement, d: D3Node): void => {
    const gSVG = d3.select(_selector);
    // Instantiate ellipse
    gSVG
      .append("rect")
      .attr("rx", 8)
      .attr("ry", 8)
      .attr("width", 35)
      .attr("height", 25)
      .attr("fill", "#fff")
      .attr("transform", "translate(-16,-15)")
      .attr("class", "shadowed");

    // Entity icon
    gSVG
      .append("image")
      .attr("height", 26)
      .attr("width", 19.5)
      .attr("transform", "translate(-8.5,-15)")
      .attr("href", findProvIcon(d.type, d.id));

    // Labeling
    gSVG
      .append("text")
      .attr("class", "font-mono")
      .attr("fill", "#000")
      .attr("font-size", "4px")
      .attr("text-anchor", "middle")
      .attr("y", "15px")
      .html(d.tag);

    addMoreDetailsIcon(gSVG, 28, -11);
  };
  const renderActivity = (_selector: SVGGElement, d: D3Node): void => {
    const gSVG = d3.select(_selector);
    // Instantiate Diamond shape
    gSVG
      .append("rect")
      .attr("width", 25)
      .attr("height", 25)
      .attr("transform", "rotate(45) translate(-16,-15)")
      .attr("stroke", "#000")
      .attr("stroke-width", "1")
      .attr("fill", "#d591e3")
      .attr("class", "shadowed");

    // Activity icon
    gSVG
      .append("image")
      .attr("height", 26)
      .attr("width", 19.5)
      .attr("transform", "translate(-10,-17)")
      .attr("href", findProvIcon(d.type, d.id));

    // Labeling
    gSVG
      .append("text")
      .attr("class", "font-mono")
      .attr("fill", "#000")
      .attr("font-size", "4px")
      .attr("text-anchor", "middle")
      .attr("y", "20px")
      .html(d.tag);

    addMoreDetailsIcon(gSVG, 21, -15);
  };

  const renderCollection = (_selector: SVGGElement, d: D3Node): void => {
    const gSVG = d3.select(_selector);
    // Instantiate ellipse
    gSVG
      .append("rect")
      .attr("rx", 8)
      .attr("ry", 8)
      .attr("width", 35)
      .attr("height", 25)
      .attr("fill", "#fff")
      .attr("transform", "translate(-16,-15)")
      .attr("class", "shadowed");

    // Entity icon
    gSVG
      .append("image")
      .attr("height", 26)
      .attr("width", 19.5)
      .attr("transform", "translate(-8.5,-15)")
      .attr("href", findProvIcon(d.type, d.id));

    // Labeling
    gSVG
      .append("text")
      .attr("class", "font-mono")
      .attr("fill", "#000")
      .attr("font-size", "4px")
      .attr("text-anchor", "middle")
      .attr("y", "15px")
      .html(d.tag);

    addMoreDetailsIcon(gSVG, 28, -11);
  };
  return {
    Agent: renderAgent,
    Entity: renderEntity,
    Activity: renderActivity,
    Collection: renderCollection,
    Default: renderDefaultNode,
  };
}

const renderDefaultNode = (_selector: SVGGElement, d: D3Node): void => {
  d3.select(_selector).append("circle").attr("r", 5).attr("fill", "#bfbfbf");
};
