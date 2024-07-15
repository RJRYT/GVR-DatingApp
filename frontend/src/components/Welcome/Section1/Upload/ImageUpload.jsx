import React, { useState, useContext, useEffect } from "react";
import "./Upload.css";
import { AuthContext } from "../../../../contexts/AuthContext";

function ImageUpload({ setUpload, Uploading, Error, UploadStatus, SetUploadStatus }) {
  const [imagePreviews, setImagePreviews] = useState([]);
  const { authState } = useContext(AuthContext);

  useEffect(()=> {
    if (
      authState.isAuthenticated &&
      authState.user &&
      authState.user.profilePic
    ) {
      const previews = authState.user.profilePic.map((file) =>file.url);
      setImagePreviews(previews);
      SetUploadStatus(true);
    }
  },[]);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
    if (window.confirm("Are you sure to upload profile images ?")) {
      setUpload(files);
    }
  };

  const fileUploadClick = (e) => {
    // eslint-disable-next-line no-restricted-globals
    if (UploadStatus && !confirm("The images are already uploaded. Do you want to update it ?")) {
      e.preventDefault();
    }
  };

  return (
    <>
      <div className="field-widget">
        <i className="fa fa-video-camera" aria-hidden="true"></i>
        <input
          type="file"
          id="imageUpload"
          accept="image/*,.png,.jpg,.jpeg"
          onChange={handleImageUpload}
          hidden
          multiple
          disabled={Uploading}
          onClick={fileUploadClick}
        />
        <label htmlFor="imageUpload" className="text-start">
          Upload Profile picture
        </label>
      </div>
      {Error.profilePics && <div className="error">{Error.profilePics}</div>}
      <div className="preview-container">
        {imagePreviews.map((preview, index) => (
          <img
            key={index}
            src={preview}
            alt={`Profile pic Preview ${index + 1}`}
            className="preview"
          />
        ))}
      </div>
    </>
  );
}

export default ImageUpload;
