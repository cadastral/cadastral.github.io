import { useAtom, useAtomValue } from "jotai";
import { Check, Clipboard, PanelLeft } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { sheetOpenAtom, tileAtom } from "@/atoms";
import { useState } from "react";

export function SideSheet() {
  const tile = useAtomValue(tileAtom);
  const [open, setOpen] = useAtom(sheetOpenAtom);

  console.log("tile", tile);

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tile?.properties?.autocad_script);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <PanelLeft />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>{tile?.properties?.name}</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-4">
          <div className="relative bg-muted rounded-md p-4 overflow-auto scrollbar-hide">
            <Button
              onClick={handleCopy}
              variant="ghost"
              size="sm"
              className="absolute top-1 right-1"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Clipboard className="w-4 h-4" />
              )}
            </Button>
            <pre className="text-sm text-muted-foreground">
              <code className="whitespace-pre-line">
                {tile?.properties?.autocad_script}
              </code>
            </pre>
          </div>
          <a href={tile?.properties?.link} target="_blank">
            <Button>Download</Button>
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
