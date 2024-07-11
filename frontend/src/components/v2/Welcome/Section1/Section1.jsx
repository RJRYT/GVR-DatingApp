import React, { useState } from "react";
import axiosInstance from "../../../../Instance/Axios";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import ImageUpload from "./Upload/ImageUpload";
import ReelUpload from "./Upload/ReelUpload";
import Modal from "react-bootstrap/Modal";
import ProgressBar from "react-bootstrap/ProgressBar";

function Section1({ onNext }) {
  const [formData, setFormData] = useState({
    age: "",
    dateOfBirth: "",
    hobbies: "",
    interests: "",
    smokingHabits: "",
    drinkingHabits: "",
    qualification: "",
  });

  const [profilePicsUploaded, setProfilePicsUploaded] = useState(false);
  const [shortReelUploaded, setShortReelUploaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // age validation
    if (!formData.age) {
      newErrors.age = "Age is required";
    }

    // dateOfBirth validation
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "date Of Birth is required";
    }

    // hobbies validation
    if (!formData.hobbies) {
      newErrors.hobbies = "Hobbies is required";
    }

    // interests validation
    if (!formData.interests) {
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
    if (!formData.qualification) {
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
    const formData = new FormData();
    for (let i = 0; i < profilePics.length; i++) {
      formData.append("profilePics", profilePics[i]);
    }
    setIsUploading(true);
    try {
      await axiosInstance.post(
        "/users/upload/profilepics",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
        {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        }
      );
      setProfilePicsUploaded(true);
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data.message || "Something Broken..! Try again later"
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleShortReelSubmit = async (shortReel) => {
    const formData = new FormData();
    formData.append("shortReel", shortReel);
    setIsUploading(true);
    try {
      await axiosInstance.post(
        "/users/upload/shortreel",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
        {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        }
      );
      setShortReelUploaded(true);
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data.message || "Something Broken..! Try again later"
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await axiosInstance.post("/users/update/personalinfo", formData);
        onNext();
      } catch (err) {
        console.error(err);
        alert(
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
                    <i className="fa fa-futbol-o" aria-hidden="true"></i>
                    <select
                      id="hobbie"
                      name="hobbies"
                      value={formData.hobbies}
                      onChange={handleInputChange}
                      disabled={isUploading}
                    >
                      <option value="" disabled>
                        Hobbies
                      </option>
                      <option value="gaming">gaming</option>
                      <option value="sleeping">sleeping</option>
                    </select>
                  </div>
                  {errors.hobbies && (
                    <div className="error">{errors.hobbies}</div>
                  )}
                </div>
                <div className="section-field mb-3">
                  <div className="field-widget">
                    <i className="fa fa-bullseye"></i>
                    <select
                      id="interests"
                      name="interests"
                      value={formData.interests}
                      onChange={handleInputChange}
                      disabled={isUploading}
                    >
                      <option value="" disabled>
                        Interests
                      </option>
                      <option value="mornig tea">mornig tea</option>
                      <option value="traveling">traveling</option>
                    </select>
                  </div>
                  {errors.interests && (
                    <div className="error">{errors.interests}</div>
                  )}
                </div>
                <div className="section-field mb-3">
                  <div className="field-widget">
                    <i className="fa fa-futbol-o"></i>
                    <select
                      id="smokingHabits"
                      name="smokingHabits"
                      value={formData.smokingHabits}
                      onChange={handleInputChange}
                      disabled={isUploading}
                    >
                      <option value="" disabled>
                        Smoking Habbits
                      </option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                      <option value="planningToQuit">Planning To Quit</option>
                    </select>
                  </div>
                  {errors.smokingHabits && (
                    <div className="error">{errors.smokingHabits}</div>
                  )}
                </div>
                <div className="section-field mb-3">
                  <div className="field-widget">
                    <i className="fa fa-beer" aria-hidden="true"></i>
                    <select
                      id="drinkingHabits"
                      name="drinkingHabits"
                      value={formData.drinkingHabits}
                      onChange={handleInputChange}
                      disabled={isUploading}
                    >
                      <option value="" disabled>
                        Drinking Habbits
                      </option>
                      <option value="regular">Regular</option>
                      <option value="planningToQuit">Planning To Quit</option>
                      <option value="socially">Socially</option>
                      <option value="occasionally">Occasionally</option>
                      <option value="teeToTaler">Teetotaler</option>
                    </select>
                  </div>
                  {errors.drinkingHabits && (
                    <div className="error">{errors.drinkingHabits}</div>
                  )}
                </div>
                <div className="section-field mb-3">
                  <div className="field-widget">
                    <i className="fa fa-graduation-cap" aria-hidden="true"></i>
                    <input
                      id="qualification"
                      type="text"
                      name="qualification"
                      placeholder="Qualifictions"
                      value={formData.qualification}
                      onChange={handleInputChange}
                      disabled={isUploading}
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
                  />
                </div>
                <div className="section-field mb-3">
                  <ReelUpload
                    setUpload={handleShortReelSubmit}
                    Uploading={isUploading}
                    Error={errors}
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
              <Modal show={isUploading}>
                <Modal.Header>
                  <Modal.Title>Uploading...</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <ProgressBar
                    animated
                    now={uploadProgress}
                    label={`${uploadProgress}%`}
                  />
                </Modal.Body>
              </Modal>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Section1;
