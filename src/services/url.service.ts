export class URLService {
  public getApplicationIdFromURL(): string {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("applicationId")!;
  }
}
