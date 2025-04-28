import { useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import { Check, Clipboard, ExternalLink, PanelLeft } from "lucide-react";
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
import { cn } from "@/lib/utils";

import carou from "@/assets/carou.png";

export function SideSheet() {
  const [open, setOpen] = useAtom(sheetOpenAtom);
  const tile = useAtomValue(tileAtom);
  const scale = useAtomValue(scaleAtom);

  const [copied, setCopied] = useState(false);

  const is500 = scale === "500";

  const center = tile ? centroid(polygon(tile.geometry.coordinates)) : null;
  const [lng, lat] = center
    ? [center.geometry.coordinates[1], center.geometry.coordinates[0]]
    : [null, null];
  const height = is500 ? "250" : "1000";

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
        <div
          className={cn(
            "flex flex-col gap-4 px-4 overflow-y-scroll",
            "scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted-foreground scrollbar-track-background",
          )}
        >
          {tile ? (
            <>
              <div className="flex gap-2">
                <a href={tile?.properties?.link} target="_blank">
                  <Button>Download</Button>
                </a>
                {center ? (
                  <a
                    href={`https://www.google.com/maps/@${lng},${lat},${height}m`}
                    target="_blank"
                  >
                    <Button variant="secondary">
                      Google Maps
                      <ExternalLink />
                    </Button>
                  </a>
                ) : null}
              </div>
              <div>AutoCAD command to draw tile perimeter.</div>
              <div className="relative bg-muted rounded-md p-4">
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
              <div>
                For quick positioning, copy the script above and paste it into
                the AutoCAD command line. The polygon will be drawn in Stereo 70
                coordinates. The points' coordinates correspondence is
                illustrated below.
              </div>
              <div className="relative bg-muted rounded-md p-4">
                <pre className="text-sm text-muted-foreground">
                  <code className="whitespace-pre-line">
                    PLINE y0, x0, y1, x1, y2, x2, y3, x3 CLOSE
                  </code>
                </pre>
              </div>
              <div className="flex justify-center w-full">
                <img src={carou} className="dark:invert" />
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
