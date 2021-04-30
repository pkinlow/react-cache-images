import React from "react";

function AppActive(props) {
  const { imageUrls } = props;

  return (
    <div className="App">
      {imageUrls.map((src, index) => (
        <img key={index} src={src} />
      ))}
    </div>
  );
}

export default AppActive;