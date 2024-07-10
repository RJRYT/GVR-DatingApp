import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../../Instance/Axios";
import { Container, Row, Col } from "react-bootstrap";
import { AuthContext } from "../../../contexts/AuthContext";
import Intro from "../Intro/Intro";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, addToken } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      navigate("/home");
      return;
    }
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username) {
      newErrors.username = "Username is required";
    } else if (!/^[a-zA-Z0-9_]{3,15}$/.test(formData.username)) {
      newErrors.username =
        "Username must be 3-15 characters long and can only contain letters, numbers, and underscores";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Phone number validation
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits long";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    // Confirm password validation
    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const res = await axiosInstance.post("/auth/email/register", formData);
        addToken(res.data.token);
        navigate("/home");
        alert("Registration Success");
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
    <>
      <Intro page="Sign Up" />
      <section className="register-form page-section-ptb bg-overlay-black-30">
        <Container>
          <Row className="justify-content-center">
            <Col lg={6}>
              <div className="register-form-inner clearfix text-center">
                <h4 className="title divider text-white">SIGN UP</h4>
                <form noValidate onSubmit={handleSubmit}>
                  <div className="section-field mb-3">
                    <div className="field-widget">
                      <i className="fa fa-user"></i>
                      <input
                        id="username"
                        type="text"
                        placeholder="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.username && (
                      <div className="error">{errors.username}</div>
                    )}
                  </div>
                  <div className="section-field mb-3">
                    <div className="field-widget">
                      <i className="fa fa-envelope"></i>
                      <input
                        id="email"
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.email && (
                      <div className="error">{errors.email}</div>
                    )}
                  </div>
                  <div className="section-field mb-3">
                    <div className="field-widget">
                      <i className="fa fa-mobile"></i>
                      <input
                        id="phoneNumber"
                        type="tel"
                        placeholder="Phone Number"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.phoneNumber && (
                      <div className="error">{errors.phoneNumber}</div>
                    )}
                  </div>
                  <div className="section-field mb-3">
                    <div className="field-widget">
                      <i className="fa fa-lock"></i>
                      <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.password && (
                      <div className="error">{errors.password}</div>
                    )}
                  </div>
                  <div className="section-field mb-3">
                    <div className="field-widget">
                      <i className="fa fa-lock"></i>
                      <input
                        id="confirmPassword"
                        type="password"
                        placeholder="confirm Password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <div className="error">{errors.confirmPassword}</div>
                    )}
                  </div>
                  <div className="clearfix"></div>
                  <div className="section-field text-end mt-2">
                    <button
                      type="submit"
                      className="button btn-lg btn-theme full-rounded animated right-icn text-decoration-none text-uppercase"
                      disabled={isSubmitting}
                    >
                      <span>
                        {isSubmitting ? "Signing Up..." : "Sign Up"}
                        <i className="fa fa-heart" aria-hidden="true"></i>
                      </span>
                    </button>
                  </div>
                  <div className="clearfix"></div>
                  <div className="section-field mt-2 text-center text-white">
                    <p className="lead mb-0">
                      Have an account?
                      <Link className="text-white" to="/login">
                        <u> Sign In!</u>
                      </Link>
                    </p>
                  </div>
                </form>
                <div className="register-social my-4 my-md-5 text-center clearfix">
                  <ul className="list-inline text-capitalize">
                    <li>
                      <Link
                        className="align-items-center d-flex otp justify-content-center"
                        to="/login/phone?register=true"
                      >
                        <i className="fa fa-mobile"></i> Sign Up With OTP
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="align-items-center d-flex google justify-content-center"
                        to={`${process.env.REACT_APP_API_URL}/api/auth/google/login`}
                      >
                        <i className="fa fa-google"></i> Sign Up With google
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Register;
