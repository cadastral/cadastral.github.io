import { Feature, Polygon } from "geojson";
import { atom } from "jotai";

export const scaleAtom = atom<"500" | "2000">("2000");
export const tileAtom = atom<Feature<Polygon> | null>(null);
export const sheetOpenAtom = atom(false);
