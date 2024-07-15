import React, { useState } from "react";
import axiosInstance from "../../../Instance/Axios";
import { Container, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";

function Section3({ onComplete, setPurpose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    purpose: "",
    confirmed: false,
  });

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "confirmed") setFormData({ ...formData, [name]: checked });
    if (name === "purpose") {
      setErrors({});
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.purpose === "longTermRelationShip") {
      // confirm validation
      if (!formData.confirmed) {
        newErrors.confirmed = "You need to confirm to continue.";
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
        await axiosInstance.post("/users/update/purpose", formData);
        setPurpose(formData.purpose);
        onComplete();
        toast.success("Done. Registration complete");
        toast.info("Start Descovering your matches...");
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
                Purpose of Registration
              </h4>
              <p className="text-center text-white fw-semibold fs-5">
                Choose your purpose of registration:
              </p>
              <form onSubmit={handleSubmit} noValidate>
                <div className="section-field mb-3">
                  <div className="field-widget">
                    <div className="radio-group">
                      <label>
                        <input
                          type="radio"
                          id="shortTermRelationShip"
                          name="purpose"
                          value="shortTermRelationShip"
                          onChange={handleInputChange}
                          checked={formData.purpose === "shortTermRelationShip"}
                        />
                        Short term
                      </label>
                      <label>
                        <input
                          type="radio"
                          id="longTermRelationShip"
                          name="purpose"
                          value="longTermRelationShip"
                          onChange={handleInputChange}
                          checked={formData.purpose === "longTermRelationShip"}
                        />
                        Long term
                      </label>
                    </div>
                  </div>
                </div>
                {formData.purpose === "shortTermRelationShip" && (
                  <div className="section-field mb-3">
                    <div className="field-widget">
                      <p className="text-center text-white fw-semibold fs-5">
                        You have choosen short term relationship. You will be
                        redirect to <u>Dating</u> section.
                        <br />
                        Note:
                        <span className="fst-italic">
                          You can't change this later.
                        </span>
                      </p>
                    </div>
                  </div>
                )}
                {formData.purpose === "longTermRelationShip" && (
                  <div className="section-field mb-3 section-checkbox">
                    <div className="field-widget">
                      <p className="text-center text-white fw-semibold fs-5">
                        You have choosen short term relationship. You will be
                        redirect to <u>matrimony</u> section.
                        <br />
                        Note:
                        <span className="fst-italic">
                          You can't change this later.
                        </span>
                      </p>
                      <label className="align-items-center d-flex justify-content-start">
                        <input
                          type="checkbox"
                          name="confirmed"
                          checked={formData.confirmed}
                          onChange={handleInputChange}
                        />
                        Add my account to matrimony app.
                      </label>
                    </div>
                    {errors.confirmed && (
                      <div className="error">{errors.confirmed}</div>
                    )}
                  </div>
                )}
                {formData.purpose && (
                  <button
                    className="button  btn-lg btn-theme full-rounded animated right-icn text-decoration-none"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    <span>
                      {isSubmitting ? "Submitting..." : "Complete"}
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

export default Section3;
