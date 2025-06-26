import { Api } from "../core/constants";
import type {
  Backend,
  ProvenaceDate,
  Provenance,
} from "../scripts/types/provenance";
import { URLService } from "./url.service";

export class ProvenanceService {
  urldecoder: URLService;

  constructor() {
    this.urldecoder = new URLService();
  }

  #extendProvenance(prov: Backend.Provenance): Provenance {
    console.log("trying to extend: ", prov);
    const extendedProv: Provenance = {};
    Object.keys(prov).forEach(
      (k) =>
        (extendedProv[k] = { ...prov[k], visibility: prov[k].starter === true })
    );
    return extendedProv;
  }
  
  public getProvenance(): Promise<Provenance> {
    const applicationId = this.urldecoder.getApplicationIdFromURL();

    return fetch(
      Api.baseURL + Api.provGraph + `?applicationId=${applicationId}`
    )
      .then((r) => r.json())
      .then((r) => this.#extendProvenance(r));
  }

  public getDetailsRDF(fair4rml: boolean): Promise<any> {
    const applicationId = this.urldecoder.getApplicationIdFromURL();
    return fetch(
      Api.baseURL +
        Api.detailsMetadata +
        `?applicationId=${applicationId}` +
        (fair4rml ? "&type=fair4ml" : "")
    ).then((r) => r.json());
  }

  public getProvenanceDate(): Promise<Date> {
    const applicationId = this.urldecoder.getApplicationIdFromURL();
    return fetch(Api.baseURL + Api.provDate + `?applicationId=${applicationId}`)
      .then((r) => r.json())
      .then((r: ProvenaceDate) => new Date(r.createdAt));
  }
}
