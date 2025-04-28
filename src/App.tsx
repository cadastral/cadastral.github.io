import { useAtom, useSetAtom } from "jotai";
import { MapProvider } from "react-map-gl/mapbox";

import { ThemeProvider } from "@/components/theme/provider";
import { Button } from "@/components/ui/button";
import { WelcomeDialog } from "@/components/WelcomeDialog";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { SideSheet } from "@/components/SideSheet";
import { Canvas } from "@/components/Canvas";
import { GoHome } from "@/components/GoHome";
import { scaleAtom, tileAtom } from "@/atoms";

function App() {
  const [scale, setScale] = useAtom(scaleAtom);
  const setTile = useSetAtom(tileAtom);

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <MapProvider>
        <div className="flex flex-col h-full">
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
            <div className="flex gap-2 items-center">
              <SideSheet />
              <GoHome />
              <Button
                className="w-16"
                onClick={() => {
                  setScale(scale === "500" ? "2000" : "500");
                  setTile(null);
                }}
              >
                {scale}
              </Button>
              <div className="hidden sm:block font-mono font-bold text-3xl">
                /cadastral/
              </div>
            </div>
            <div className="flex gap-2">
              <ModeToggle />
              <WelcomeDialog />
            </div>
          </header>

          <div className="flex-1">
            <Canvas />
          </div>
        </div>
      </MapProvider>
    </ThemeProvider>
  );
}

export default App;
