import { useState } from "react";

interface AccordionTools {
  open: boolean;
  setOpen(open: boolean): void;
  twHeightClass: string;
}

export function useAccordionTools() {
  const [open, setOpen] = useState<boolean>(false);

  return {
    open,
    setOpen,
    twHeightClass: open ? "max-h-screen p-1" : "max-h-0 p-0",
  } as AccordionTools;
}
