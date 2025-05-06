import { Api } from '../core/constants';
import { Backend, Provenance } from '../types/provenance';

export class ProvenanceService {
	#extendProvenance(prov: Backend.Provenance): Provenance {
		const extendedProv: Provenance = {};
		Object.keys(prov).forEach(
			(k) =>
				(extendedProv[k] = { ...prov[k], visibility: prov[k].type === 'Agent' })
		);
		return extendedProv;
	}

	#getApplicationIdFromURL(): string {
		const urlParams = new URLSearchParams(window.location.search);
		return urlParams.get('applicationId')!;
	}

	public getProvenance(): Promise<Provenance> {
		const applicationId = this.#getApplicationIdFromURL();
		return fetch(
			Api.baseURL + Api.provGraph + `?applicationId=${applicationId}`
		)
			.then((r) => r.json())
			.then((r) => this.#extendProvenance(r));
	}

	public getDetailsRDF(fair4rml: boolean): Promise<any> {
		const applicationId = this.#getApplicationIdFromURL();
		return fetch(
			Api.baseURL +
				Api.detailsMetadata +
				`?applicationId=${applicationId}` +
				(fair4rml
				? '&type=fair4ml'
				: '')
		).then((r) => r.json());
	}
}
