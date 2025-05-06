import * as d3 from 'd3';
import { Backend } from './provenance';
// shape: rectangle -> activities, oval -> entities, triangle -> agents
/**
 * Provenance Frontend graph types for D3
 */
export type D3Simulation = d3.Simulation<D3Node, D3Link>;

interface D3BaseLink extends d3.SimulationLinkDatum<D3Node> {
	label: string;
	id: string;
}

export interface D3IDLink extends D3BaseLink {
	source: string;
	target: string;
}

// Post simulation
export interface D3Link extends D3BaseLink {
	source: D3Node;
	target: D3Node;
}

// Post simulation
export interface D3Node extends d3.SimulationNodeDatum, Backend.IRINode {
	x?: number;
	y?: number;
	color?: string;
}

export interface IRINode extends D3Node {
	type: 'Agent' | 'Activity' | 'Entity';
}

export interface ProvGraph {
	// if does not validate as I want do <N extends BaseNode>
	nodes: D3Node[];
	links: D3Link[];
}

export interface InitGraph {
	nodes: D3Node[];
	links: D3IDLink[];
}
