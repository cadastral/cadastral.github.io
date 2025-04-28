import { useMap } from "react-map-gl/mapbox";
import { HomeIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function GoHome() {
  const { cadastralMap } = useMap();

  const goHome = () => {
    console.log(cadastralMap);
    cadastralMap?.flyTo({
      center: [26.11, 44.44],
      zoom: 11,
      pitch: 0,
      bearing: 0,
    });
  };

  return (
    <Button onClick={() => goHome()}>
      <HomeIcon />
    </Button>
  );
}
