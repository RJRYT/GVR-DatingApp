import React, { useState } from "react";
import axiosInstance from "../../../Instance/Axios";
import { Container, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";

import { expertLevel, locations } from "../../../assets/data/Data";
import SingleSelect from "../Select/SingleSelect";

function Section2({ onNext }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    professionType: "",
    companyName: "",
    designation: "",
    jobLocation: "",
    expertiseLevel: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "professionType") setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (
      formData.professionType === "employee" ||
      formData.professionType === "employer"
    ) {
      if (!formData.companyName) {
        // companyName validation
        newErrors.companyName = "Company name is required";
      }

      // designation validation
      if (!formData.designation) {
        newErrors.designation = "Designation is required";
      }

      // jobLocation validation
      if (!formData.jobLocation) {
        newErrors.jobLocation = "Location is required";
      }
    }

    if (formData.professionType === "jobseeker") {
      // expertiseLevel validation
      if (!formData.expertiseLevel) {
        newErrors.expertiseLevel = "Expertise level is required";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await axiosInstance.post("/users/update/professionalinfo", formData);
        onNext();
        toast.success("Section Completed");
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
                Professional Details
              </h4>
              <p className="text-center text-white fw-semibold fs-5">
                Choose your current professional status:
              </p>
              <form onSubmit={handleSubmit} noValidate>
                <div className="section-field mb-3">
                  <div className="field-widget">
                    <div className="radio-group">
                      <label>
                        <input
                          type="radio"
                          id="employee"
                          name="professionType"
                          value="employee"
                          onChange={handleInputChange}
                          checked={formData.professionType === "employee"}
                        />
                        Employee
                      </label>
                      <label>
                        <input
                          type="radio"
                          id="employer"
                          name="professionType"
                          value="employer"
                          onChange={handleInputChange}
                          checked={formData.professionType === "employer"}
                        />
                        Employer
                      </label>
                      <label>
                        <input
                          type="radio"
                          id="jobseeker"
                          name="professionType"
                          value="jobseeker"
                          onChange={handleInputChange}
                          checked={formData.professionType === "jobseeker"}
                        />
                        Jobseeker
                      </label>
                    </div>
                  </div>
                </div>
                {(formData.professionType === "employee" ||
                  formData.professionType === "employer") && (
                  <>
                    <div className="section-field mb-3">
                      <div className="field-widget">
                        <i className="fa fa-building-o"></i>
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          placeholder="Company Name"
                        />
                      </div>
                      {errors.companyName && (
                        <div className="error">{errors.companyName}</div>
                      )}
                    </div>
                    <div className="section-field mb-3">
                      <div className="field-widget">
                        <i className="fa fa-briefcase"></i>
                        <input
                          type="text"
                          name="designation"
                          value={formData.designation}
                          onChange={handleInputChange}
                          placeholder="Designation"
                        />
                      </div>
                      {errors.designation && (
                        <div className="error">{errors.designation}</div>
                      )}
                    </div>
                    <div className="section-field mb-3">
                      <div className="field-widget">
                        <i className="fa fa-map-marker"></i>
                        <SingleSelect
                          name="jobLocation"
                          OnChange={handleInputChange}
                          Options={locations}
                          Placeholder="Location"
                          AllowNew={true}
                        />
                      </div>
                      {errors.jobLocation && (
                        <div className="error">{errors.jobLocation}</div>
                      )}
                    </div>
                  </>
                )}
                {formData.professionType === "jobseeker" && (
                  <div className="section-field mb-3">
                    <div className="field-widget">
                      <i className="fa fa-graduation-cap"></i>
                      <SingleSelect
                        name="expertiseLevel"
                        OnChange={handleInputChange}
                        Options={expertLevel}
                        Placeholder="Expertise Level"
                        AllowNew={false}
                      />
                    </div>
                    {errors.expertiseLevel && (
                      <div className="error">{errors.expertiseLevel}</div>
                    )}
                  </div>
                )}
                {formData.professionType && (
                  <button
                    className="button  btn-lg btn-theme full-rounded animated right-icn text-decoration-none"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    <span>
                      {isSubmitting ? "Submitting..." : "Next"}
                      <i className="fa fa-heart" aria-hidden="true"></i>
                    </span>
                  </button>
                )}
              </form>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Section2;
