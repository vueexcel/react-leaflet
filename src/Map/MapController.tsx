import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet-draw";
import "leaflet.path.drag";
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

        // Create a polyline to detect the click on the edge of the polygon
        const latLngs = layer.getLatLngs()[0]; // Get the vertices of the polygon
        const polyline = new L.Polyline(latLngs, { color: "transparent" }); // Create invisible polyline on the edges
        polyline.on("click", (e: any) => {
          const clickedLatLng = e.latlng; // Capture the latLng where the user clicked

          // Create a polygon drawing mode starting from the clicked point
          const newPolygonDrawer = new L.Draw.Polygon(map as L.DrawMap, {
            // @ts-ignore
            ...drawControl.options.draw.polygon,
            showArea: true,
          });

          newPolygonDrawer.enable();
          // Add the first point where the user clicked
          newPolygonDrawer.addVertex(clickedLatLng);
        });
        polyline.addTo(map);

        const isIntersecting = checkIntersection(layer);
        layer.dragging.enable();

        if (isIntersecting) {
          layer.setStyle({ color: polygon.drawError?.color || "red" }); // Change color to red if intersecting
        }

        layer.on("click", (e: any) => {
          featureGroupRef.current?.eachLayer((l: any) => {
            // Disable on click again
            if (l === layer && !l.editing._enabled) {
              l.setStyle({ color: "blue" });
              l.editing.enable();
              l.dragging.disable();
            } else {
              l.setStyle({ color: polygon.shapeOptions?.color || "green" });
              l.editing.disable();
              l.dragging.enable();
            }
          });
        });

        layer.on("drag", () => {
          const isIntersecting = checkIntersection(layer);
          featureGroupRef.current?.eachLayer((existingLayer: any) => {
            if (existingLayer !== layer) {
              existingLayer.editing.disable();
              existingLayer.setStyle({
                color: polygon.shapeOptions?.color || "green",
              });
            }
          });
          if (isIntersecting) {
            layer.setStyle({ color: polygon.drawError?.color || "red" });
          } else {
            layer.setStyle({ color: "blue" });
          }
        });

        layer.on("dragend", () => {
          const isIntersecting = checkIntersection(layer);
          if (isIntersecting) {
            layer.setStyle({ color: polygon.drawError?.color || "red" });
          } else {
            layer.setStyle({ color: polygon.shapeOptions?.color || "green" });
          }
        });
      }
    });

    // Event handler Editing start
    map.on(L.Draw.Event.EDITSTART, () => {
      featureGroupRef.current?.eachLayer((existingLayer: any) => {
        existingLayer.setStyle({ color: "blue" });
        existingLayer.dragging.disable();
      });
    });

    // Event handler Editing stops
    map.on(L.Draw.Event.EDITSTOP, () => {
      featureGroupRef.current?.eachLayer((existingLayer: any) => {
        existingLayer.setStyle({
          color: polygon.shapeOptions?.color || "green",
        });
        existingLayer.dragging.enable();
      });
    });

    // Event handler when a layer is edited
    map.on(L.Draw.Event.EDITED, (e: any) => {
      const layers = e.layers;
      layers.eachLayer((layer: any) => {
        // Check for intersections on each edited layer
        const isIntersecting = checkIntersection(layer);
        featureGroupRef.current?.removeLayer(layer);

        if (isIntersecting) {
          layer.setStyle({ color: polygon.drawError?.color || "red" }); // Change color to red if intersecting
        } else {
          layer.setStyle({ color: polygon.shapeOptions?.color || "green" }); // Default color if no intersection
        }

        layer.dragging.enable();
        // Ensure the feature group is updated
        featureGroupRef.current?.addLayer(layer);
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, featureGroupRef]);

  return null;
};
