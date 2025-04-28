import { useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import { Check, Clipboard, PanelLeft } from "lucide-react";
import { Feature, Polygon } from "geojson";
import { centroid } from "@turf/centroid";
import { polygon } from "@turf/helpers";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { scaleAtom, sheetOpenAtom, tileAtom } from "@/atoms";

export function SideSheet() {
  const tile: Feature<Polygon> | undefined = useAtomValue(tileAtom);
  const [open, setOpen] = useAtom(sheetOpenAtom);
  const scale = useAtomValue(scaleAtom);

  const [copied, setCopied] = useState(false);

  const center = tile ? centroid(polygon(tile.geometry.coordinates)) : null;

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
        <SheetHeader className="border-b-2">
          <SheetTitle>
            {tile ? tile.properties?.name : "no selection"}
          </SheetTitle>
          <SheetDescription className="hidden"></SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-4">
          {tile ? (
            <>
              <div>AutoCAD command to draw tile perimeter.</div>
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
              <div className="flex">
                <a href={tile?.properties?.link} target="_blank">
                  <Button>Carou</Button>
                </a>
                {center ? (
                  <Button variant="link">
                    <a
                      href={`https://www.google.com/maps/@${center.geometry.coordinates[1]},${center.geometry.coordinates[0]},${scale === "2000" ? "1000" : "250"}m`}
                      target="_blank"
                    >
                      Google Maps
                    </a>
                  </Button>
                ) : null}
              </div>
            </>
          ) : (
            "please select a tile"
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
