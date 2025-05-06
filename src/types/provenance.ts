/**
 * Provenance JSON (Raw fetched) types
 * TODO: esta mal pensado el rootNode podria ser irinode y le restas complejidad
 */
export namespace Backend {
	export interface IRINode {
		id: string;
		iri: string;
		tag: string;
		type: 'Entity' | 'Activity' | 'Agent';
		disabled: boolean
		relations: Relations
	}

	export type LiteralNode = {
		id: string;
		type: 'Literal';
		datatype: string;
		value: any;
	};

	export type ProvNode = IRINode | LiteralNode;
	export type Relations = Record<string, ProvNode[]>;
	// Raw provenance from backend
	export interface Provenance {
		[key: string]: Backend.IRINode;
	}
}
// Parsed Provenance structured for frontend use
export interface Provenance {
	[key: string]: Backend.IRINode & { visibility: boolean };
}
