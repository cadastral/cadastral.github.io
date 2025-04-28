import { useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import Map, { Layer, Source } from "react-map-gl/mapbox";
import type { LayerProps, MapMouseEvent } from "react-map-gl/mapbox";
import type { GeoJSON } from "geojson";

import { themeAtom } from "@/components/theme/constants";
import { Card } from "@/components/ui/card";
import { scaleAtom, sheetOpenAtom, tileAtom } from "@/atoms";

// TODO: this need to be in /public, and default needs to be 2000 (smaller)
import geo_500 from "@/assets/500.json";
import geo_2000 from "@/assets/2000.json";

import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN =
  "pk.eyJ1Ijoic2FiaW51IiwiYSI6ImNtOXp4bW93eTBxb2QybHNoM2EwMXJsam0ifQ.-bCis9OqE0RaMMGKcu0TkQ";

export function Canvas() {
  const initialView = { longitude: 26.11, latitude: 44.44, zoom: 11 };

  const theme = useAtomValue(themeAtom);
  const scale = useAtomValue(scaleAtom);
  const setTileAtom = useSetAtom(tileAtom);
  const setSheetOpenAtom = useSetAtom(sheetOpenAtom);

  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const [coords, setCoords] = useState({ lng: 26.11, lat: 44.44 });

  const handleMapClick = (event: MapMouseEvent) => {
    const feature = event.features?.[0];
    if (feature != undefined) {
      setTileAtom(feature);
      setSelectedFeature(feature.properties?.name);
      setSheetOpenAtom(true);
    }
  };

  const layerConfigCadastru: LayerProps = {
    id: "cadastru-layer",
    type: "fill",
    paint: {
      "fill-color": [
        "case",
        ["==", ["get", "name"], selectedFeature],
        "#50f", // violet selected
        "#088", // teal unselected
      ],
      "fill-opacity": 0.3,
      "fill-outline-color": "#000",
    },
    filter: ["!=", ["get", "gasit"], "nu"],
  };

  const background =
    theme == "light"
      ? "mapbox://styles/mapbox/light-v11"
      : "mapbox://styles/mapbox/dark-v11";

  const geojson =
    scale === "500" ? (geo_500 as GeoJSON) : (geo_2000 as GeoJSON);

  return (
    <>
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={initialView}
        style={{ width: "100%", height: "100%" }}
        mapStyle={background}
        maxBounds={[
          [19.6, 43.3], // Southwest coordinates
          [31.0, 48.5], // Northeast coordinates
        ]}
        onMouseMove={(e) => {
          setCoords({
            lat: Number(e.lngLat.lat.toFixed(5)),
            lng: Number(e.lngLat.lng.toFixed(5)),
          });
        }}
        interactiveLayerIds={["cadastru-layer"]}
        onClick={handleMapClick}
      >
        <Source id="cadastru" type="geojson" data={geojson}>
          <Layer {...layerConfigCadastru} />
        </Source>
      </Map>
      <Card className="absolute bottom-4 right-4 px-4 py-2 rounded-full text-sm font-mono">
        {coords.lat.toFixed(4)},{coords.lng.toFixed(4)}
      </Card>
    </>
  );
}
