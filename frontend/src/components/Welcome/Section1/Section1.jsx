import React, { useState } from "react";
import axiosInstance from "../../../Instance/Axios";
import { Container, Row, Col } from "react-bootstrap";
import ImageUpload from "./Upload/ImageUpload";
import ReelUpload from "./Upload/ReelUpload";
import { toast } from "react-toastify";

import {
  drinkingHabits,
  gender,
  hobbies,
  interests,
  locations,
  qualifications,
  smokingHabits,
} from "../../../assets/data/Data";
import MultiSelect from "../Select/MultiSelect";
import SingleSelect from "../Select/SingleSelect";

function Section1({ onNext }) {
  const [formData, setFormData] = useState({
    age: "",
    dateOfBirth: "",
    gender: "",
    location: "",
    hobbies: [],
    interests: [],
    smokingHabits: "",
    drinkingHabits: "",
    qualification: [],
  });

  const [profilePicsUploaded, setProfilePicsUploaded] = useState(false);
  const [shortReelUploaded, setShortReelUploaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // age validation
    if (!formData.age) {
      newErrors.age = "Age is required";
    } else if (formData.age < 20 || formData.age > 40) {
      newErrors.age = "Age must be between 20 and 40.";
    }

    // dateOfBirth validation
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "date Of Birth is required";
    }

    if (formData.age && formData.dateOfBirth) {
      const calculatedAge =
        new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear();

      if (calculatedAge !== parseInt(formData.age, 10)) {
        newErrors.age = "Age and date of birth do not match.";
        newErrors.dateOfBirth = "Age and date of birth do not match.";
      }
    }

    // gender validation
    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    // location validation
    if (!formData.location) {
      newErrors.location = "Location is required";
    }

    // hobbies validation
    if (!formData.hobbies.length) {
      newErrors.hobbies = "Hobbies is required";
    }

    // interests validation
    if (!formData.interests.length) {
      newErrors.interests = "Interests is required";
    }

    // smokingHabits validation
    if (!formData.smokingHabits) {
      newErrors.smokingHabits = "smoking Habits is required";
    }

    // drinkingHabits validation
    if (!formData.drinkingHabits) {
      newErrors.drinkingHabits = "drinking Habits is required";
    }

    // qualification validation
    if (!formData.qualification.length) {
      newErrors.qualification = "Qualification is required";
    }

    // profile pic validation
    if (!profilePicsUploaded) {
      newErrors.profilePics = "profilePics is required";
    }

    // Short reel validation
    if (!shortReelUploaded) {
      newErrors.shortReel = "shortReel is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProfilePicSubmit = async (profilePics) => {
    if (profilePics.length > 5) {
      toast.error("You can only choose upto 5 images");
      return;
    }
    const formData = new FormData();
    for (let i = 0; i < profilePics.length; i++) {
      formData.append("profilePics", profilePics[i]);
    }
    setIsUploading(true);
    const uploadToastId = toast.info("Profile Pics upload started", {
      autoClose: false,
    });
    try {
      await axiosInstance.post("/users/upload/profilepics", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          if (progress === 100) {
            toast.update(uploadToastId, {
              render: `Processing...`,
              type: "info",
              autoClose: false,
            });
          } else {
            toast.update(uploadToastId, {
              render: `Upload progress: ${progress}%`,
              type: "info",
              autoClose: false,
            });
          }
        },
      });
      toast.update(uploadToastId, {
        render: "Profile Pics upload completed",
        type: "success",
        autoClose: 3000,
      });
      setProfilePicsUploaded(true);
    } catch (err) {
      console.error(err);
      toast.update(uploadToastId, {
        render:
          err.response?.data.message || "Something Broken..! Try again later",
        type: "error",
        autoClose: 3000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleShortReelSubmit = async (shortReel) => {
    const formData = new FormData();
    formData.append("shortReel", shortReel);
    setIsUploading(true);
    const uploadToastId = toast.info("Short reel upload started", {
      autoClose: false,
    });
    try {
      await axiosInstance.post("/users/upload/shortreel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          if (progress === 100) {
            toast.update(uploadToastId, {
              render: `Processing...`,
              type: "info",
              autoClose: false,
            });
          } else {
            toast.update(uploadToastId, {
              render: `Upload progress: ${progress}%`,
              type: "info",
              autoClose: false,
            });
          }
        },
      });
      setShortReelUploaded(true);
      toast.update(uploadToastId, {
        render: "Short reel upload completed",
        type: "success",
        autoClose: 3000,
      });
    } catch (err) {
      console.error(err);
      toast.update(uploadToastId, {
        render:
          err.response?.data.message || "Something Broken..! Try again later",
        type: "error",
        autoClose: 3000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await axiosInstance.post("/users/update/personalinfo", formData);
        onNext();
        toast.success("Section Completed.");
      } catch (err) {
        console.error(err);
        toast.error(
          err.response?.data.message || "Something Broken..! Try again later"
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <section className="register-1-form register-img dark-bg page-section-ptb">
      <Container>
        <Row className="justify-content-center">
          <Col lg={6}>
            <div className="register-form-inner clearfix text-center">
              <h4 className="title divider text-white mb-3">
                Personal Details
              </h4>
              <form onSubmit={handleSubmit} noValidate>
                <div className="section-field mb-3">
                  <div className="field-widget">
                    <i className="fa fa-user"></i>
                    <input
                      id="Age"
                      type="number"
                      placeholder="Age"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      disabled={isUploading}
                    />
                  </div>
                  {errors.age && <div className="error">{errors.age}</div>}
                </div>
                <div className="section-field mb-3">
                  <div className="field-widget">
                    <i className="fa fa-calendar"></i>
                    <input
                      id="Dob"
                      type="date"
                      name="dateOfBirth"
                      max="2004-12-30"
                      placeholder="date of birth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      disabled={isUploading}
                    />
                  </div>
                  {errors.dateOfBirth && (
                    <div className="error">{errors.dateOfBirth}</div>
                  )}
                </div>
                <div className="section-field mb-3">
                  <div className="field-widget">
                    <i className="fa fa-venus-mars" aria-hidden="true"></i>
                    <SingleSelect
                      name="gender"
                      OnChange={handleInputChange}
                      Options={gender}
                      Disabled={isUploading}
                      Placeholder="Gender"
                      AllowNew={false}
                    />
                  </div>
                  {errors.gender && (
                    <div className="error">{errors.gender}</div>
                  )}
                </div>
                <div className="section-field mb-3">
                  <div className="field-widget">
                    <i className="fa fa-map-marker" aria-hidden="true"></i>
                    <SingleSelect
                      name="location"
                      OnChange={handleInputChange}
                      Options={locations}
                      Disabled={isUploading}
                      Placeholder="Location"
                      AllowNew={true}
                    />
                  </div>
                  {errors.location && (
                    <div className="error">{errors.location}</div>
                  )}
                </div>
                <div className="section-field mb-3">
                  <div className="field-widget">
                    <i className="fa fa-futbol-o" aria-hidden="true"></i>
                    <MultiSelect
                      name="hobbies"
                      OnChange={handleInputChange}
                      Options={hobbies}
                      Disabled={isUploading}
                      Placeholder="Hobbies"
                    />
                  </div>
                  {errors.hobbies && (
                    <div className="error">{errors.hobbies}</div>
                  )}
                </div>
                <div className="section-field mb-3">
                  <div className="field-widget">
                    <i className="fa fa-bullseye"></i>
                    <MultiSelect
                      name="interests"
                      OnChange={handleInputChange}
                      Options={interests}
                      Disabled={isUploading}
                      Placeholder="Interests"
                    />
                  </div>
                  {errors.interests && (
                    <div className="error">{errors.interests}</div>
                  )}
                </div>
                <div className="section-field mb-3">
                  <div className="field-widget">
                    <i className="fa fa-futbol-o"></i>
                    <SingleSelect
                      name="smokingHabits"
                      OnChange={handleInputChange}
                      Options={smokingHabits}
                      Disabled={isUploading}
                      Placeholder="Smoking Habits"
                      AllowNew={false}
                    />
                  </div>
                  {errors.smokingHabits && (
                    <div className="error">{errors.smokingHabits}</div>
                  )}
                </div>
                <div className="section-field mb-3">
                  <div className="field-widget">
                    <i className="fa fa-beer" aria-hidden="true"></i>
                    <SingleSelect
                      name="drinkingHabits"
                      OnChange={handleInputChange}
                      Options={drinkingHabits}
                      Disabled={isUploading}
                      Placeholder="Drinking Habits"
                      AllowNew={false}
                    />
                  </div>
                  {errors.drinkingHabits && (
                    <div className="error">{errors.drinkingHabits}</div>
                  )}
                </div>
                <div className="section-field mb-3">
                  <div className="field-widget">
                    <i className="fa fa-graduation-cap" aria-hidden="true"></i>
                    <MultiSelect
                      name="qualification"
                      OnChange={handleInputChange}
                      Options={qualifications}
                      Disabled={isUploading}
                      Placeholder="Qualifictions"
                    />
                  </div>
                  {errors.qualification && (
                    <div className="error">{errors.qualification}</div>
                  )}
                </div>
                <div className="section-field mb-3">
                  <ImageUpload
                    setUpload={handleProfilePicSubmit}
                    Uploading={isUploading}
                    Error={errors}
                    UploadStatus={profilePicsUploaded}
                    SetUploadStatus={setProfilePicsUploaded}
                  />
                </div>
                <div className="section-field mb-3">
                  <ReelUpload
                    setUpload={handleShortReelSubmit}
                    Uploading={isUploading}
                    Error={errors}
                    UploadStatus={shortReelUploaded}
                    SetUploadStatus={setShortReelUploaded}
                  />
                </div>
                <div className="clearfix"></div>
                <div className="section-field text-uppercase text-center mt-2">
                  <button
                    className="button  btn-lg btn-theme full-rounded animated right-icn text-decoration-none"
                    type="submit"
                    disabled={isSubmitting || isUploading}
                  >
                    <span>
                      {isSubmitting ? "Submitting..." : "Next"}
                      <i className="fa fa-heart" aria-hidden="true"></i>
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Section1;
