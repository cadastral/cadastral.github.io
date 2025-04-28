import { useState } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  Map,
  Layer,
  Source,
  GeolocateControl,
  ScaleControl,
} from "react-map-gl/mapbox";
import type { LayerProps, MapMouseEvent } from "react-map-gl/mapbox";
import type { Feature, GeoJSON, Polygon } from "geojson";

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
  const [tile, setTile] = useAtom(tileAtom);
  const setSheetOpenAtom = useSetAtom(sheetOpenAtom);

  const [coords, setCoords] = useState({ lng: 26.11, lat: 44.44 });

  const is500 = scale === "500";
  const isLight = theme === "light";

  const handleMapClick = (event: MapMouseEvent) => {
    const feature = event.features?.[0];
    if (feature != undefined) {
      setTile(feature as Feature<Polygon>);
      // setSelectedFeature(feature.properties?.name);
      setSheetOpenAtom(true);
    }
  };

  const [minZ, maxZ] = is500 ? [14, 18] : [12, 16];

  const layerLabelsCadastru: LayerProps = {
    id: "cadastru-labels",
    type: "symbol",
    layout: {
      "text-field": ["get", "name"],
      "text-size": ["interpolate", ["linear"], ["zoom"], minZ, 12, maxZ, 48],
      "text-anchor": "center",
      "symbol-placement": "point",
      "symbol-avoid-edges": true,
      "text-allow-overlap": false,
    },
    paint: { "text-color": isLight ? "#222" : "#ddd" },
    filter: ["!=", ["get", "gasit"], "nu"],
    minzoom: minZ,
    maxzoom: maxZ,
  };

  const layerConfigCadastru: LayerProps = {
    id: "cadastru-layer",
    type: "fill",
    paint: {
      "fill-color": [
        "case",
        ["==", ["get", "name"], tile ? tile.properties?.name : null],
        "#50f", // violet selected
        "#088", // teal unselected
      ],
      "fill-opacity": 0.3,
      "fill-outline-color": isLight ? "#000" : "#fff",
    },
    filter: ["!=", ["get", "gasit"], "nu"],
  };

  const background = isLight
    ? "mapbox://styles/mapbox/light-v11"
    : "mapbox://styles/mapbox/dark-v11";

  const geojson = is500 ? (geo_500 as GeoJSON) : (geo_2000 as GeoJSON);

  return (
    <>
      <Map
        id="cadastralMap"
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={initialView}
        style={{ width: "100%", height: "100%" }}
        mapStyle={background}
        maxBounds={[
          [19.6, 43.3], // Southwest coordinates
          [31.0, 48.6], // Northeast coordinates
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
        <GeolocateControl />
        <ScaleControl />

        <Source id="cadastru" type="geojson" data={geojson}>
          <Layer {...layerLabelsCadastru} />
          <Layer {...layerConfigCadastru} />
        </Source>
      </Map>
      <Card className="absolute bottom-4 right-4 px-4 py-2 rounded-full text-sm font-mono">
        {coords.lat.toFixed(4)},{coords.lng.toFixed(4)}
      </Card>
    </>
  );
}
