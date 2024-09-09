import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";
import { MapControllerPropsTypes } from "../types/MapControllerTypes";
import * as turf from "@turf/turf";

export const MapController: React.FC<MapControllerPropsTypes> = ({
  featureGroupRef,
  edit,
  polygon,
}) => {
  const map = useMap();
  // Ref to track if controls have been initialized
  const drawControlRef = useRef<L.Control.Draw | null>(null);

  useEffect(() => {
    if (!map || !featureGroupRef.current || drawControlRef.current) return;

    // Initialize draw control
    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: featureGroupRef.current!,
        edit: edit,
      },
      draw: {
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false,
        polygon: polygon,
      },
    });

    // Add draw control to the map
    map.addControl(drawControl);
    drawControlRef.current = drawControl;

    const checkIntersection = (layer: any) => {
      const layerGeoJson = layer.toGeoJSON();
      const newPolygon = turf.polygon(layerGeoJson.geometry.coordinates);
      let isIntersecting = false;

      featureGroupRef.current?.eachLayer((existingLayer) => {
        if (existingLayer instanceof L.Polygon && existingLayer !== layer) {
          const existingLayerGeoJson = existingLayer.toGeoJSON() as any;
          const existingPolygon = turf.polygon(
            existingLayerGeoJson.geometry.coordinates
          );

          // Use turf.js to check for intersection
          const intersection = turf.intersect(
            turf.featureCollection([newPolygon, existingPolygon])
          );

          if (intersection) {
            isIntersecting = true;
          }
        }
      });

      return isIntersecting;
    };

    // Event handler when a polygon is created
    map.on(L.Draw.Event.CREATED, (e: any) => {
      const { layerType, layer } = e;
      if (layerType === "polygon") {
        featureGroupRef.current?.addLayer(layer);

        const isIntersecting = checkIntersection(layer);

        if (isIntersecting) {
          layer.setStyle({ color: polygon.drawError?.color || "red" }); // Change color to red if intersecting
        }
      }
    });

    // Event handler when a layer is edited
    map.on(L.Draw.Event.EDITED, (e: any) => {
      const layers = e.layers;
      layers.eachLayer((layer: any) => {
        // Check for intersections on each edited layer
        if (layer instanceof L.Polygon) {
          const isIntersecting = checkIntersection(layer);

          featureGroupRef.current?.removeLayer(layer);

          if (isIntersecting) {
            layer.setStyle({ color: polygon.drawError?.color || "red" }); // Change color to red if intersecting
          } else {
            layer.setStyle({ color: polygon.shapeOptions?.color || "blue" }); // Default color if no intersection
          }

          // Ensure the feature group is updated
          featureGroupRef.current?.addLayer(layer);
        }
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, featureGroupRef]);

  return null;
};
