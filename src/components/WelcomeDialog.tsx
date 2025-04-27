import { atomWithStorage } from "jotai/utils";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";
import { useAtom } from "jotai";

const welcomeAtom = atomWithStorage("welcome", true);

export function WelcomeDialog() {
  const [welcome, setWelcome] = useAtom(welcomeAtom);

  return (
    <Dialog open={welcome} onOpenChange={(open) => setWelcome(open)}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Info />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Salut, bine ai venit la /cadastral/</DialogTitle>
          <DialogDescription>
            Un serviciu ce organizează carourile cadastrale ale Bucureștiului
            din 1990.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 w-full">
          <Button type="button" variant="secondary">
            <a target="_blank" href="https://goo.gl/6880E9">
              Documentatie
            </a>
          </Button>
          <Button type="button" variant="secondary">
            <a target="_blank" href="https://goo.gl/6PtRpK">
              Feed-back
            </a>
          </Button>
          <Button type="button" variant="secondary">
            <a target="_blank" href="https://goo.gl/CgiLND">
              Discord (FIX)
            </a>
          </Button>
        </div>
        <div>
          Plus începutul unei harți cu date despre proiecte din România.
        </div>
        <div className="flex gap-2 w-full">
          <Button type="button" variant="secondary">
            <a target="_blank" href="map_base.html">
              Harta (FIX)
            </a>
          </Button>
          <Button type="button" variant="secondary">
            <a target="_blank" href="https://fb.me/definit.buc">
              Facebook Page
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
