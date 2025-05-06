import * as d3 from 'd3';
import { D3Node } from '../types/graph';
import { findProvIcon } from '../utils/utils';
import { detailsPanelRender } from '../render/detailspanel';

export function Render() {
	// d -> D3Node
	const plusIconOnClickHandler = (event: MouseEvent, d: any) =>
		detailsPanelRender(d);

	const renderAgent = (_selector: SVGGElement, d: D3Node): void => {
		const gSVG = d3.select(_selector);
		// Instantatiate yellow circle with shadow filter
		gSVG
			.append('circle')
			.attr('r', 15)
			.attr('fill', '#fffac9')
			.attr('class', 'shadowed');

		// Logo
		gSVG
			.append('image')
			.attr('height', 26)
			.attr('width', 19.5)
			.attr('transform', 'translate(-10,-13)')
			.attr('href', findProvIcon(d.type, d.id));

		// Labeling
		gSVG
			.append('text')
			.attr('class', 'font-mono')
			.attr('fill', '#000')
			.attr('font-size', '5px')
			.attr('text-anchor', 'middle')
			.attr('y', '20px')
			.html(d.tag);

		// + circle
		gSVG
			.append('circle')
			.attr('r', 3)
			.attr('transform', 'translate(22, -12)')
			.attr('fill', '#fff')
			//.on('click', enableDirectLinks);
			.on('click', plusIconOnClickHandler);

		// + symbol
		gSVG
			.append('text')
			.attr('class', 'font-mono')
			.attr('font-size', '4px')
			.attr('transform', 'translate(20.8,-10.8)')
			.style('pointer-events', 'none')
			.html('+');
	};

	const renderEntity = (_selector: SVGGElement, d: D3Node): void => {
		const gSVG = d3.select(_selector);
		// Instantiate ellipse
		gSVG
			.append('rect')
			.attr('rx', 8)
			.attr('ry', 8)
			.attr('width', 35)
			.attr('height', 25)
			.attr('fill', '#fff')
			.attr('transform', 'translate(-16,-15)')
			.attr('class', 'shadowed');

		// Labeling
		gSVG
			.append('text')
			.attr('class', 'font-mono')
			.attr('fill', '#000')
			.attr('font-size', '4px')
			.attr('text-anchor', 'middle')
			.attr('y', '15px')
			.html(d.tag);

		// Instantiate + circle
		gSVG
			.append('circle')
			.attr('r', 3)
			.attr('transform', 'translate(22, -12)')
			.attr('fill', '#fff')
			.on('click', plusIconOnClickHandler);

		// + symbol
		gSVG
			.append('text')
			.attr('class', 'font-normal font-mono')
			.attr('font-size', '4px')
			.attr('transform', 'translate(20.8,-10.8)')
			.style('pointer-events', 'none')
			.html('+');

		// Entity icon
		gSVG
			.append('image')
			.attr('height', 26)
			.attr('width', 19.5)
			.attr('transform', 'translate(-8.5,-15)')
			.attr('href', findProvIcon(d.type, d.id));
	};
	const renderActivity = (_selector: SVGGElement, d: D3Node): void => {
		const gSVG = d3.select(_selector);
		// Instantiate Diamond shape
		gSVG
			.append('rect')
			.attr('width', 25)
			.attr('height', 25)
			.attr('transform', 'rotate(45) translate(-16,-15)')
			.attr('stroke', '#000')
			.attr('stroke-width', '1')
			.attr('fill', '#d591e3')
			.attr('class', 'shadowed');

		// Labeling
		gSVG
			.append('text')
			.attr('class', 'font-mono')
			.attr('fill', '#000')
			.attr('font-size', '4px')
			.attr('text-anchor', 'middle')
			.attr('y', '20px')
			.html(d.tag);

		// Activity icon
		gSVG
			.append('image')
			.attr('height', 26)
			.attr('width', 19.5)
			.attr('transform', 'translate(-10,-17)')
			.attr('href', findProvIcon(d.type, d.id));

		// Instantiate + circle
		gSVG
			.append('circle')
			.attr('r', 3)
			.attr('transform', 'translate(22, -12)')
			.attr('fill', '#fff')
			.on('click', plusIconOnClickHandler);

		// + symbol
		gSVG
			.append('text')
			.attr('class', 'font-normal font-mono')
			.attr('font-size', '4px')
			.attr('transform', 'translate(20.8,-10.8)')
			.style('pointer-events', 'none')
			.html('+');
	};

	return {
		Agent: renderAgent,
		Entity: renderEntity,
		Activity: renderActivity,
		Default: renderDefaultNode,
	};
}

const renderDefaultNode = (_selector: SVGGElement, d: D3Node): void => {
	d3.select(_selector).append('circle').attr('r', 5).attr('fill', '#bfbfbf');
};
