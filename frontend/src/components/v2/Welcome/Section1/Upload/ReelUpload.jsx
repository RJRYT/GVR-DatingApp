import React, { useState } from "react";
import "./Upload.css";

function ReelUpload({ setUpload, Uploading, Error }) {
  const [videoPreview, setVideoPreview] = useState(null);

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setVideoPreview(previewURL);
      if (window.confirm("Are you sure to upload this short reel ?")) {
        setUpload(file);
      }
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
          disabled={Uploading}
        />
        <label htmlFor="videoUpload" className="text-start">
          Select Short Reel
        </label>
      </div>
      {Error.shortReel && <div className="error">{Error.shortReel}</div>}
      {videoPreview && (
        <div className="preview-container">
          <video src={videoPreview} className="preview" controls />
        </div>
      )}
    </>
  );
}

export default ReelUpload;
