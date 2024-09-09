import React, { useRef } from "react";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { MapController } from "./MapController";
import { MapComponentPropType } from "../types/MapComponentType";
import {
  DEFAULT_POSITION,
  editOptions,
  polygonOptions,
  styles as mapStyles,
  zoom as mapZoom,
} from "../constants/map";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";

const MapComponent: React.FC<MapComponentPropType> = ({
  center = DEFAULT_POSITION,
  zoom = mapZoom,
  styles = mapStyles,
  edit = editOptions,
  polygon = polygonOptions,
}) => {
  const featureGroupRef = useRef<L.FeatureGroup>(null);

  return (
    <MapContainer center={center} zoom={zoom} style={styles}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* FeatureGroup to hold drawn shapes */}
      <FeatureGroup ref={featureGroupRef}></FeatureGroup>

      {/* Add controls in the map */}
      <MapController
        featureGroupRef={featureGroupRef}
        edit={edit}
        polygon={polygon}
      />
    </MapContainer>
  );
};

export default MapComponent;
