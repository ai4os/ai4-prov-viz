import {
	faChevronDown,
	faTimes,
	faFileArrowDown,
} from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

export function initFontAwesomeIcons() {
	library.add(faChevronDown);
	library.add(faTimes);
	library.add(faFileArrowDown);
}
