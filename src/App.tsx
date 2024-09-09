import React from "react";
import "./App.css";
import MapComponent from "./Map/MapComponent";
import {
  DEFAULT_POSITION,
  editOptions,
  polygonOptions,
  styles,
  zoom,
} from "./constants/map";

function App() {
  return (
    <div className="App">
      <MapComponent
        center={DEFAULT_POSITION}
        zoom={zoom}
        styles={styles}
        edit={editOptions}
        polygon={polygonOptions}
      />
    </div>
  );
}

export default App;
