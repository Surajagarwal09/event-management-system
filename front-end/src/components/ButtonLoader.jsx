import React from "react";
import "../css/ButtonLoader.css"

const ButtonLoader = ({ loading, children, ...props }) => {
  return (
    <button {...props} disabled={loading || props.disabled}>
      {loading ? (
        <div className="button-loader">
          <img src="/Dual Ball200px.gif" alt="Loading..." />
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default ButtonLoader;
