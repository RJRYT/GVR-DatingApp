import React, { useState } from "react";
import "./Upload.css";

function ReelUpload() {
  const [videoPreview, setVideoPreview] = useState(null);

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setVideoPreview(previewURL);
    }
  };

  return (
    <>
      <div className="field-widget">
        <i className="fa fa-camera" aria-hidden="true"></i>
        <input
          type="file"
          id="videoUpload"
          accept="video/mp4,video/webm"
          onChange={handleVideoUpload}
          hidden
        />
        <label htmlFor="videoUpload" className="text-start">
          Select Short Reel
        </label>
      </div>
      {videoPreview && (
        <div className="preview-container">
          <video src={videoPreview} className="preview" controls />
        </div>
      )}
    </>
  );
}

export default ReelUpload;
