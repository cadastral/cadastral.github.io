import { useAtom } from "jotai";

import { ThemeProvider } from "@/components/theme/provider";
import { Button } from "@/components/ui/button";
import { WelcomeDialog } from "@/components/WelcomeDialog";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { Canvas } from "@/components/Canvas";
import { scaleAtom } from "@/atoms";

function App() {
  const [scale, setScale] = useAtom(scaleAtom);

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="flex flex-col h-full">
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <Button onClick={() => setScale(scale === "500" ? "2000" : "500")}>
            {scale}
          </Button>
          <div className="flex gap-2">
            <ModeToggle />
            <WelcomeDialog />
          </div>
        </header>

        <div className="flex-1">
          <Canvas />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
