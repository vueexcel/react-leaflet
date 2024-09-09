import { Edit, PolylineOptions } from "../types/MapComponentType";
import React from "react";
import L from "leaflet";

export type MapControllerPropsTypes = {
  featureGroupRef: React.RefObject<L.FeatureGroup>;
  edit: false | Edit;
  polygon: PolylineOptions;
};
