import { initD3Graph } from './init/init';


document.querySelector('#app')!.innerHTML = `
<div id="container" class="w-full h-full relative">
<div id="details-group" class="hidden w-[35vw] absolute top-3 end-3 font-mono">
</div>
</div>
`;

const container = document.querySelector('#container')! as HTMLElement;
initD3Graph(container);
