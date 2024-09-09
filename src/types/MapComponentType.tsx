import React from "react";
import L from "leaflet";

export type Edit = {
  selectedPathOptions?:
    | L.LayerOptions
    | L.InteractiveLayerOptions
    | L.PathOptions;
  poly?: L.EditToolbar.EditPolyOptions;
};

export type PolylineOptions = L.DrawOptions.PolylineOptions;

export type MapComponentPropType = {
  center?: [number, number];
  zoom?: number;
  styles?: React.CSSProperties;
  edit?: false | Edit;
  polygon?: PolylineOptions;
};
