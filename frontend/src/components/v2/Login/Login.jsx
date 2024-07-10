import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../../Instance/Axios";
import { Container, Row, Col } from "react-bootstrap";
import { AuthContext } from "../../../contexts/AuthContext";
import Intro from "../Intro/Intro";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
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
        const res = await axiosInstance.post("/auth/email/login", formData);
        addToken(res.data.token);
        navigate("/home");
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
      <Intro page="Sign In" />
      <section className="login-form page-section-ptb bg-overlay-black-30">
        <Container>
          <Row className="justify-content-center">
            <Col lg={6}>
              <div className="login-form-inner clearfix text-center">
                <h4 className="title divider text-white">SIGN IN</h4>
                <div className="login-social my-4 my-md-5 text-center clearfix">
                  <ul className="list-inline text-capitalize">
                    <li>
                      <Link
                        className="align-items-center d-flex otp justify-content-center"
                        to="/login/phone"
                      >
                        <i className="fa fa-mobile"></i> Sign in With OTP
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="align-items-center d-flex google justify-content-center"
                        to={`${process.env.REACT_APP_API_URL}/api/auth/google/login`}
                      >
                        <i className="fa fa-google"></i> Sign in With google
                      </Link>
                    </li>
                  </ul>
                </div>
                <form noValidate onSubmit={handleSubmit}>
                  <div className="section-field mb-3">
                    <div className="field-widget">
                      <i className="fa fa-user"></i>
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
                  <div className="section-field">
                    <Link
                      to="/forget"
                      className="float-end text-white text-decoration-none text-uppercase"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="clearfix"></div>
                  <div className="section-field text-end mt-2">
                    <button
                      type="submit"
                      className="button btn-lg btn-theme full-rounded animated right-icn text-decoration-none text-uppercase"
                      disabled={isSubmitting}
                    >
                      <span>
                        {isSubmitting ? "Signing In..." : "Sign In"}
                        <i className="fa fa-heart" aria-hidden="true"></i>
                      </span>
                    </button>
                  </div>
                  <div className="clearfix"></div>
                  <div className="section-field mt-2 text-center text-white">
                    <p className="lead mb-0">
                      Don’t have an account?
                      <Link className="text-white" to="/register">
                        <u>Register now!</u>
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Login;
