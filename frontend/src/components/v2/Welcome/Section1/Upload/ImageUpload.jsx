import React, { useState } from "react";
import "./Upload.css";

function ImageUpload({ setUpload, Uploading, Error }) {
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
    if(window.confirm("Are you sure to upload profile images ?")){
      setUpload(files);
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
