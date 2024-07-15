import React, { useState, useContext, useEffect } from "react";
import "./Upload.css";
import { AuthContext } from "../../../../contexts/AuthContext";
 

function ReelUpload({ setUpload, Uploading, Error, UploadStatus, SetUploadStatus }) {
  const [videoPreview, setVideoPreview] = useState(null);
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    if (
      authState.isAuthenticated &&
      authState.user &&
      authState.user.shortReel
    ) {
      setVideoPreview(authState.user.shortReel.url);
      SetUploadStatus(true);
    }
  }, []);

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

  const fileUploadClick = (e) => {
    // eslint-disable-next-line no-restricted-globals
    if (UploadStatus && !confirm("The reel is already uploaded. Do you want to update it ?")) {
      e.preventDefault();
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
          onClick={fileUploadClick}
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
