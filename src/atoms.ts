import { atom } from "jotai";
import { GeoJSONFeature } from "mapbox-gl";

export const scaleAtom = atom("500");
export const tileAtom = atom<GeoJSONFeature>();
export const sheetOpenAtom = atom(false);
