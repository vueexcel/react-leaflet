import MapComponent from "../Map/MapComponent";

export default {
  title: "Map",
  component: MapComponent,
};

export const InitialView = {
  args:{
    center:[40.7128, -74.006],
    zoom:20,
    edit:false,
    styles:{ height: "100vh", width: "100%" },
    polygon:false,
  },
};

export const DrawPolygon = {
  args:{
    polygon:{
      "allowIntersection": false,
      "maxPoints": 7,

      "shapeOptions": {
        "stroke": true,
        "color": "blue",
        "weight": 4,
        "opacity": 0.5,
        "fill": true,
        "fillColor": null,
        "fillOpacity": 0.2,
        "clickable": true
      }
    },
  },
};

export const EditPolygon = {
  args: {
    edit: {
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
    },
  },
};

export const PolygonIntersectionError = {
  args: {
    polygon: {
      allowIntersection: false, // Avoid polygon intersections
      drawError: {
        color: "red",
        message: "Intersection is not allowed",
        timeout: 2000,
      },
      maxPoints: 5,
      shapeOptions: {
        color: "blue",
        opacity: 0.5,
      },
    },
  },
};
