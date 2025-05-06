import { ProvenanceService } from "./provenance.service"

export const downloadDetailsFile = async (fair4rml: boolean, filename: string) =>  {
    const data = await new ProvenanceService().getDetailsRDF(fair4rml)
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'})
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
     // we add and remove the element for compatibility with firefox and other browsers
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}