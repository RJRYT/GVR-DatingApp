import React, { useState } from "react";
import "./Upload.css";

function ImageUpload() {
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
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
        />
        <label htmlFor="imageUpload" className="text-start">
          Upload Profile picture
        </label>
      </div>
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
