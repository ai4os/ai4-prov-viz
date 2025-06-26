import * as d3 from "d3";
import type { D3Node, D3Link, D3Simulation, D3IDLink } from "../types/graph";
import { Render } from "../render/graphnodes";
import { miniIRI, ruleToHReadable } from "../utils/utils";

let globalG: d3.Selection<SVGGElement, undefined, null, undefined> | undefined =
  undefined;

// Behaviours
const dragBehaviour = (simulation: D3Simulation) => {
  function dragstarted(event: d3.D3DragEvent<SVGGElement, D3Node, D3Node>) {
    if (!event.active) simulation.alphaTarget(0.1).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event: d3.D3DragEvent<SVGGElement, D3Node, D3Node>) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(event: d3.D3DragEvent<SVGGElement, D3Node, D3Node>) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  return d3
    .drag<SVGGElement, D3Node>()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
};

const zoomBehaviour = d3.zoom().on("zoom", (event) => {
  let { x, y, k } = event.transform;

  const UPPER_ZOOM_LIMIT = 1.5;
  const LOWER_ZOOM_LIMIT = 0.75;

  if (UPPER_ZOOM_LIMIT < k) k = UPPER_ZOOM_LIMIT;
  if (LOWER_ZOOM_LIMIT > k) k = LOWER_ZOOM_LIMIT;

  const HORIZONTAL_LIMIT = 300;
  const VERTICAL_LIMIT = 200;
  if (x > HORIZONTAL_LIMIT) x = HORIZONTAL_LIMIT;
  if (x < -HORIZONTAL_LIMIT) x = -HORIZONTAL_LIMIT;
  if (y > VERTICAL_LIMIT) y = VERTICAL_LIMIT;
  if (y < -VERTICAL_LIMIT) y = -VERTICAL_LIMIT;

  globalG!.attr("transform", `translate(${x}, ${y}) scale(${k})`);
});

/**
 * Creates a graph
 * @param container The HTML element to contain the SVG
 * @param nodes Initial graph nodes
 * @param links Initial graph links
 * @param onNodeClick Callback for node click events
 * @param onLinkClick Callback for link click events
 * @returns An object with the SVG element and an update method
 */
export function createD3Graph(
  container: HTMLElement,
  nodes: D3Node[],
  links: D3IDLink[],
  onNodeClick: (event: MouseEvent, d: D3Node) => void,
  onLinkClick: (event: MouseEvent, l: D3Link) => void
) {
  // If graph already exists dont do anything
  if (document.getElementById("graphCanvas")) return;

  // Graph
  const render = Render();

  const width = innerWidth;
  const height = innerHeight;
  const simulation: D3Simulation = d3 // Tune the forces to make it good looking
    .forceSimulation<D3Node>(nodes)
    .force(
      "collide",
      d3.forceCollide().radius((d) => 70)
    )
    .force(
      "link",
      d3.forceLink<D3Node, D3IDLink>(links).id((d) => d.id)
    )
    .force("center", d3.forceCenter(width / 2, height / 2 + 10).strength(0.5)) // todo: tune it!
    .on("tick", ticked);

  const viewBoxWidth = 400; // 350
  const viewBoxHeight = 400; // 350
  const startXViewBox = width / 2 - viewBoxWidth / 2;
  const startYViewBox = height / 2 - viewBoxHeight / 2;
  const svg = d3
    .create("svg")
    .attr("id", "graphCanvas")
    .attr("width", `${width}px`)
    .attr("height", `${height}px`)
    .attr("viewBox", [
      startXViewBox,
      startYViewBox,
      viewBoxWidth,
      viewBoxHeight,
    ]);
  // Apply behaviours
  svg.call(zoomBehaviour as any);

  // (SVG defs) arrow marker
  const defs = svg.append("defs");
  defs
    .append("marker")
    .attr("id", "arrowhead")
    .attr("viewBox", "-0 -5 10 10")
    .attr("refX", 0)
    .attr("refY", 0)
    .attr("orient", "auto")
    .attr("markerWidth", 5)
    .attr("markerHeight", 10)
    .attr("xoverflow", "visible")
    .append("svg:path")
    .attr("d", "M 0, -5 L 10, 0 L 0, 5")
    .attr("fill", "#000")
    .attr("stroke", "none");

  globalG = svg.append("g");

  let svgLinks: d3.Selection<SVGLineElement, D3Link, SVGGElement, undefined> =
    globalG.append("g").selectAll("path").attr("marker-end", "url(#arrowhead)");

  let svgNodes: d3.Selection<SVGGElement, D3Node, SVGGElement, undefined> =
    globalG.append("g").selectAll("g");

  const buildSVGArc = (
    originX: number,
    originY: number,
    archX: number,
    archY: number,
    sweepFlag: number,
    endX: number,
    endY: number
  ) =>
    `M ${originX} , ${originY} A ${archX} ${archY} 0 0 ${sweepFlag} ${endX} , ${endY}`;

  function ticked() {
    // D3 Update method for simulation
    // Curved links positioning
    svgLinks.attr("d", (d) => {
      let dx = d.target.x! - d.source.x!,
        dy = d.target.y! - d.source.y!,
        dr = Math.sqrt(dx * dx + dy * dy);
      let sweepFlag = 0;
      if (d.source.x! < d.target.x!) {
        sweepFlag = 1;
      }
      // setear en la estructura global la curva invertida (al reves) para poder poner el texto
      return buildSVGArc(
        d.source.x!,
        d.source.y!,
        dr,
        dr,
        sweepFlag,
        d.target.x!,
        d.target.y!
      );
    });

    svgLinks.attr("d", function (d) {
      // mirar que objeto es this console.log(this)
      let pl = this.getTotalLength(),
        r = 15 + 10,
        m = this.getPointAtLength(pl - r);
      let dx = m.x - d.source.x!,
        dy = m.y - d.source.y!,
        dr = Math.sqrt(dx * dx + dy * dy);
      let sweepFlag = 0;
      const pathId = `path-${d.id}`;
      const reverPathId = pathId + "-reversed";

      // Calculating reverse path
      // TODO: se podria hacer mejor si divides los paths en dos selecciones distintas en el metodo update un arrow paths (en lugar de svgLinks
      // y un reversepaths que se usa solo para pintar correctament los textos)
      const reversePathSelect = document.getElementById(reverPathId);
      if (!reversePathSelect) {
        svg
          .append("path")
          .attr("id", reverPathId)
          .attr("d", () =>
            buildSVGArc(m.x, m.y, dr, dr, 1, d.source.x!, d.source.y!)
          )
          .style("fill", "none");
      } else {
        reversePathSelect.setAttribute(
          "d",
          buildSVGArc(m.x, m.y, dr, dr, 1, d.source.x!, d.source.y!)
        );
      }
      const labelSelect = document.getElementById(`label-${d.id}`);
      if (labelSelect) {
        labelSelect.setAttribute("href", `#${reverPathId}`);
      }
      if (d.source.x! < d.target.x!) {
        // fix this make path invisible and dont render all paths
        sweepFlag = 1;
        // Positioning label
        if (labelSelect) {
          labelSelect.setAttribute("href", `#${pathId}`);
        }
      }

      // Positioning label
      return buildSVGArc(d.source.x!, d.source.y!, dr, dr, sweepFlag, m.x, m.y);
    });

    // Node positioning
    svgNodes.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
  }

  container.append(svg.node()!);

  return Object.assign(svg.node()!, {
    // Update graph method
    update({ nodes, links }: { nodes: D3Node[]; links: any }) {
      const existingNodes = svgNodes.data(nodes, (d) => d.id);
      let enterNodes = existingNodes
        .enter()
        .append("g")
        .attr("class", (d) => d.type + "-node")
        .call(dragBehaviour(simulation))
        .on("click", onNodeClick);

      // Rendering new nodes
      enterNodes.each(function (d) {
        switch (d.type) {
          case "Agent":
            render.Agent(this, d);
            break;
          case "Entity":
            render.Entity(this, d);
            break;
          case "Activity":
            render.Activity(this, d);
            break;
          case "Collection":
            render.Collection(this, d);
            break;
          default:
            render.Default(this, d);
        }
      });

      // Merging old + existing nodes
      svgNodes = enterNodes.merge(existingNodes);

      // Binding data with svgLinks
      const existingLinks = svgLinks.data(links as D3IDLink[], (d: D3Link) => {
        return [d.source, d.target];
      });

      // Removing old links
      existingLinks.exit().remove();

      // Creating links for entering links
      const svgLinksPaths = existingLinks
        .enter()
        .append("g")
        .attr("class", "link");

      // Appending text labels to links
      svgLinksPaths
        .append("text")
        .attr("class", "font-normal font-mono")
        .attr("font-size", "5px")
        .append("textPath")
        .attr("id", (d: any) => `label-${d.id}`)
        .attr("text-anchor", "middle")
        .attr("startOffset", "50%")
        .append("tspan")
        .attr("dy", "-4px")
        .html((d) => ruleToHReadable(miniIRI(d.label)!));

      // Appending paths to links
      svgLinks = svgLinksPaths
        .append("path")
        .attr("id", (d) => `path-${d.id}`)
        .attr("marker-end", "url(#arrowhead)")
        .attr("stroke", "#000")
        .attr("fill", "transparent")
        .on("click", onLinkClick as any);

      simulation.nodes(nodes);
      simulation
        .force<d3.ForceLink<D3Node, D3Link>>("link")!
        .links(links as D3Link[]);
      simulation.force(
        "forceY",
        d3.forceY(height / 2 - 100).y((d, _) => 1.6)
      );
      simulation.force("many", d3.forceManyBody().strength(1));
      simulation.alpha(1.5).restart().tick();
      ticked();
    },
  });
}
