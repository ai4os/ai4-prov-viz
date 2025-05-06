import { ProvenanceService } from '../services/provenance.service';
import { D3Link, D3Node } from '../types/graph';
import { GraphUtils } from './preprocess';
import { createD3Graph } from '../d3-graph/graph';
import { Provenance, Backend } from '../types/provenance';
import { initFontAwesomeIcons } from '../core/config/font-awesome-icons';

let provenance: Provenance; // TODO: probably will be better to treat this as a global variable
let graph: any;

const updateGraph = () => {
	const { nodes, links } = GraphUtils.processProvenance(provenance);
	graph.update({ nodes, links });
};

const onNodeClick = (event: MouseEvent, d: D3Node) => {
	// Prevent dragging to avoid simulation recalc?
	event.preventDefault();
	let newVisibleNode = false;
	Object.entries(provenance).forEach(([k, o]) => {
		// Enables nodes who points to this node but not the ones that the source node points to
		if (
			Object.values(o.relations)
				.flat()
				.find((link) => link.id == d.id) &&
			!provenance[k].visibility
		) {
			provenance[k].visibility = true;
			newVisibleNode = true;
		}
	});
	if (newVisibleNode) updateGraph();
};

const onLinkClick = (event: MouseEvent, d: D3Link) => {
	console.log('link click');
};

export const getNodeToRelations = (d: Backend.ProvNode): Backend.Relations => {
	const nodeKey = Object.keys(provenance).find((n) => n == d.id)!;
	const toChildren: Backend.Relations = { ...provenance[nodeKey].relations };
	return toChildren;
};

const initgraph = async (container: HTMLElement) => {
	const rawprovenance = await new ProvenanceService().getProvenance();
	provenance = rawprovenance;
	const { nodes, links } = GraphUtils.processProvenance(rawprovenance);
	graph = createD3Graph(
		container,
		nodes,
		links,
		onNodeClick,
		onLinkClick
	);
	graph.update({ nodes, links });
};

export const initD3Graph = async (
	container: HTMLElement
) => {
	initFontAwesomeIcons();
	await initgraph(container);
};
