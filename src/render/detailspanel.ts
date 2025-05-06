import { Heading, DOMUtils } from '../utils/dom-utils';
import { D3Node } from '../types/graph';
import { getNodeToRelations } from '../init/init';
import { ruleToHReadable, findProvIcon, miniIRI } from '../utils/utils';
import { Backend } from '../types/provenance';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { isObjectEmpty } from '../utils/utils';
import { downloadDetailsFile } from '../services/file-downloader.service';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

const goToNodeIRIIfExistis = (event: MouseEvent, d: Backend.ProvNode) => {
	if (d.type == 'Literal') return;
	window.open(d.iri, '_blank', 'noopener,noreferrer');
};

function detailsPanel() {
	const ACCORDIONCOLORS = ['#0953CC', '#1E6FF5', '#629BF8'];
	let globalInfoBlockId = 0;
	let visible: boolean = false;
	let detailsGroup: HTMLElement;

	const toggle = (d: D3Node) => {
		detailsGroup = document.querySelector('#details-group')!;
		if (visible) {
			dissapear(); // Empty details panel
			toggleVisibility();
			return;
		}
		render(d); // Fills the details panel
		toggleVisibility();
	};

	const dissapear = () => (detailsGroup.innerHTML = '');

	const toggleVisibility = () => {
		DOMUtils.toggleVisibility(detailsGroup);
		visible = !visible;
	};

	const loadToChild = (
		e: HTMLElement,
		n: Backend.ProvNode,
		anidation: number = 0
	) => {
		const toChild = getNodeToRelations(n);
		Object.entries(toChild).forEach(([link, toNodes]) => {
			const linkContainer = document.createElement('div');
			linkContainer.className = `flex flex-col w-full max-h-[80vh] gap-1 p-2 rounded-md overflox-x-hidden text-white`;
			linkContainer.style.backgroundColor =
				ACCORDIONCOLORS[anidation % ACCORDIONCOLORS.length];
			const ruleTitle = Heading.appendTitle(linkContainer, ruleToHReadable(miniIRI(link)!), "shadowed-text");
			tippy(ruleTitle, {
				content: link,
				placement: 'left'
			})
			const NodeContainer = document.createElement('div');
			NodeContainer.className =
				'flex flex-col w-full max-h-[70vh] overflow-y-scroll text-black font-normal no-scrollbar gap-1 pl-1 pt-[0.5em] pb-[0.5em] pe-[0.3em]';
			linkContainer.appendChild(NodeContainer);
			toNodes.forEach((n) => {
				NodeContainer.appendChild(renderNodeBlock(n, anidation));
			});
			e.appendChild(linkContainer);
		});
	};
	const renderValueBlock = (n: Backend.LiteralNode) => {
		const valueBlock = document.createElement('div');
		valueBlock.className = 'flex flex-row';
		const valueSpan = document.createElement('span');
		valueSpan.className = 'font-sans text-base';
		let value = n.value;
		if (n.datatype == 'dateTime') {
			value = new Date(isNaN(n.value) ? n.value : Number(n.value))
				.toISOString()
				.split('T');
			value = value[0] + ' ' + value[1].slice(0, -1);
		}
		valueSpan.innerHTML = value;
		valueBlock.appendChild(valueSpan);
		return valueBlock;
	};
	const renderNodeBlock = (n: Backend.ProvNode, anidation: number = 0) => {
		if (n.type == 'Literal') {
			return renderValueBlock(n);
		}
		// n is ProvNode go type it!
		const renderNodeInfoBlock = (id: number) => {
			const nodeInfoBlock = document.createElement('div');
			nodeInfoBlock.id = `${id}`;
			nodeInfoBlock.className =
				'flex flex-col gap-2 max-h-0 overflow-hidden w-full transition-all duration-300';
			loadToChild(nodeInfoBlock, n, anidation + 1);
			return nodeInfoBlock;
		};
		const nodeBlock = document.createElement('div');
		nodeBlock.className = 'flex flex-col gap-2';
		const nodeBlockHeading = document.createElement('div');
		nodeBlockHeading.className =
			'flex flex-row items-center justify-between p-1 pl-2 pr-2 bg-white rounded-sm transition-color duration-100 ' +
			'hover:not-focus:bg-slate-200';
		const nodeBlockHeadingTitle = document.createElement('div');
		nodeBlockHeadingTitle.className = 'flex flex-row gap-2 items-center';
		Heading.appendIcon(nodeBlockHeadingTitle, findProvIcon(n.type, n.iri));
		Heading.appendTitle(
			nodeBlockHeadingTitle,
			n.tag,
			'hover:text-blue-500 cursor-default'
		);
		nodeBlockHeadingTitle.onclick = (e) => goToNodeIRIIfExistis(e, n);
		nodeBlockHeading.appendChild(nodeBlockHeadingTitle);
		nodeBlock.appendChild(nodeBlockHeading);

		if (!isObjectEmpty(getNodeToRelations(n))) {
			// Render chevron down icon
			const chevronDown = document.createElement('span');
			chevronDown.className = 'transition-all';
			chevronDown.innerHTML = icon({
				prefix: 'fas',
				iconName: 'chevron-down',
			}).html[0];
			const infoBlockId = globalInfoBlockId;
			globalInfoBlockId += 1;
			chevronDown.onclick = () => {
				const childrenNodesBlock = document.getElementById(`${infoBlockId}`)!;
				if (chevronDown.classList.contains('rotate-90')) {
					// It gets animated with the max-h property, TODO: is there any better way to do this?
					chevronDown.classList.remove('rotate-90');
					childrenNodesBlock.classList.replace('max-h-screen', 'max-h-0');
					return;
				}
				chevronDown.classList.add('rotate-90');
				childrenNodesBlock.classList.replace('max-h-0', 'max-h-screen');
			};
			chevronDown.style.cursor = 'pointer';
			nodeBlockHeading.appendChild(chevronDown);
			// Load child
			const nodeInfoBlock = renderNodeInfoBlock(infoBlockId);
			nodeBlock.appendChild(nodeInfoBlock);
		}
		return nodeBlock;
	};

	const render = (d: D3Node) => {
		// Load child nodes in details panel first layer
		const basePanel = document.createElement('div');
		basePanel.id = 'details-0';
		basePanel.className =
			'flex flex-col overflow-y-scroll rounded-md w-full max-h-[95vh] no-scrollbar gap-2 p-1 pl-2 pt-2 pb-3 bg-slate-700/30 font-semibold';
		const heading = document.createElement('div');
		heading.className = 'flex flex-col gap-1 p-0';

		const mainHeading = document.createElement('div');
		mainHeading.className = 'flex justify-between pr-2';
		Heading.appendTitle(mainHeading, d.tag, 'font-semibold text-xl text-white');
		const crossIcon = document.createElement('span');
		crossIcon.innerHTML = icon({ prefix: 'fas', iconName: 'times' }).html[0];
		crossIcon.style.color = "#fff"
		crossIcon.style.cursor = 'pointer';
		crossIcon.onclick = dissapear;
		mainHeading.appendChild(crossIcon);
		heading.appendChild(mainHeading);
		if (/\(app\).*/.test(d.tag)) {
			// If is node is the application node we add download buttons for metadata formats: deeph and fair4ml
			const downlButtonsContainer = document.createElement('div');
			downlButtonsContainer.className = 'flex justify-start gap-2 pr-2';

			// Deep Hybrid formatted file download button
			const deephButton = document.createElement('button');
			deephButton.classList.add('details-downloader-button')
			deephButton.innerHTML = icon({ prefix: 'fas', iconName: 'file-arrow-down' }).html[0];
			deephButton.addEventListener('click', async () => {
				await downloadDetailsFile(false, `${d.tag}-deepHybrid.json`);
			});
			downlButtonsContainer.appendChild(deephButton);

			// fair4ml RDF file download button
			const fair4mlButton = document.createElement('button');
			fair4mlButton.classList.add('details-downloader-button')
			fair4mlButton.innerHTML = '<img src="/icons/fair4ml.png" class="object-contain"> </img>'
			fair4mlButton.addEventListener('click', async () => {
				await downloadDetailsFile(true, `${d.tag}-fair4ml.json`);
			});
			downlButtonsContainer.appendChild(fair4mlButton);

			heading.appendChild(downlButtonsContainer);
		}
		basePanel.appendChild(heading);

		// Adding each node
		loadToChild(basePanel, d, 0);
		detailsGroup.appendChild(basePanel);
	};

	return toggle;
}

export const detailsPanelRender = detailsPanel();
