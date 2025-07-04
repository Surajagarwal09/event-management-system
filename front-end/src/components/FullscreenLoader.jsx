import React from "react";
import "../css/FullScreenLoader.css";

function FullScreenLoader() {
  return (
    <div className="fullscreen-loader">
      <img src="front-end/public/Eclipse.gif" alt="Loading..." className="loader-image" />
    </div>
  );
}

export default FullScreenLoader;
