import { Feature, Polygon } from "geojson";
import { atom } from "jotai";

export const scaleAtom = atom("2000");
export const tileAtom = atom<Feature<Polygon>>();
export const sheetOpenAtom = atom(false);
