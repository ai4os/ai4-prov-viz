/*
 * DOM Rendering utils
 */

const appendTitle = (e: HTMLElement, title: string, classes?: string) => {
	const headingTitle = document.createElement('span');
	// TODO: preguntar porque me sigue dejando moverme hacia la derecha a pesar de text-ellipsis
	headingTitle.className =
		'font-base font-mono text-sm text-ellipsis overflow-y-clip ' +
		(classes ?? '');
	headingTitle.innerHTML = title;
	e.appendChild(headingTitle);
	return headingTitle;
};

const appendIcon = (e: HTMLElement, iconhref: string) => {
	const icon = document.createElement('img');
	icon.className = 'w-5 h-auto';
	icon.setAttribute('src', iconhref);
	e.appendChild(icon);
	return icon;
};

export const Heading = { appendTitle, appendIcon };

export const Building = {};


const toggleVisibility = (e: HTMLElement) => {
	// This function toggles visibility if and only if there was already 
	// set hidden or block in the classname of the html element
	const className = e.getAttribute('class')!;
	if (className.includes('hidden')) {
		const classnameVisible = className.replace('hidden', 'block');
		e.setAttribute('class', classnameVisible);
		return;
	}
	const classnameHidden = className.replace('block', 'hidden');
	e.setAttribute('class', classnameHidden);
};


export const DOMUtils = {toggleVisibility}
