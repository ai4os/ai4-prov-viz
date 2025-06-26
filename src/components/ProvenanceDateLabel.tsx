import { useEffect, useState } from "react";
import { ProvenanceService } from "../services/provenance.service";

export function ProvenanceDateLabel() {
  const [date, setDate] = useState<Date>();

  useEffect(() => {
    new ProvenanceService().getProvenanceDate().then((r) => setDate(r));
  }, []);

  return (
    <div className="w-auto absolute bottom-3 end-3">
      <span className="font-base text-black/50">
        {date && `Generated on ${date.toUTCString()}`}
      </span>
    </div>
  );
}
