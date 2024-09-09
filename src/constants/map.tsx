import { PolylineOptions, Edit } from "../types/MapComponentType";

export const DEFAULT_POSITION: [number, number] = [40.7128, -74.006];

export const zoom: number = 13;

export const editOptions: Edit = {
  selectedPathOptions: {
    opacity: 0.5,
  },
  poly: {
    allowIntersection: false,
    drawError: {
      color: "red",
      message: "Intersection is not allowed",
      timeout: 2000,
    },
  },
};

export const polygonOptions: PolylineOptions = {
  allowIntersection: false, // Avoid polygon intersections
  drawError: {
    color: "red",
    message: "Intersection is not allowed",
    timeout: 2000,
  },
  maxPoints: 5,
  shapeOptions: {
    color: "green",
    opacity: 0.5,
  },
};

export const styles = { height: "100vh", width: "100%" };
