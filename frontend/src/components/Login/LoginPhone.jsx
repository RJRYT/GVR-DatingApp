import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../Instance/Axios";
import { Container, Row, Col } from "react-bootstrap";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import Loading from "../Loading/Loading";
import Intro from "../Intro/Intro";
import "./Login.css";

const LoginPhone = () => {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    otp: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();
  const { authState, checkAuthStatus, loading } = useContext(AuthContext);

  const urlParams = new URLSearchParams(window.location.search);
  const isRegister = urlParams.get("register");

  useEffect(() => {
    if (!loading && authState.isAuthenticated) navigate("/welcome");
  }, []);

  const handleSendOtp = async (e) => {
    const newErrors = {};
    e.preventDefault();
    const validNumber = new RegExp("^[0-9]{10}$");
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
      setErrors(newErrors);
    } else if (!validNumber.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits long";
      setErrors(newErrors);
    } else {
      setErrors({});
      setIsSubmitting(true);
      try {
        await axiosInstance.post("/auth/number/sendotp", {
          phoneNumber: formData.phoneNumber,
        });
        toast.success("OTP is send to given number");
        setIsOtpSent(true);
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

  const ResentOTP = (e) => {
    e.preventDefault();
    setIsOtpSent(false);
    setFormData((prevData) => ({
      ...prevData,
      otp: "",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const newErrors = {};
    const validOTP = new RegExp("^[0-9]{6}$");
    if (!formData.phoneNumber) {
      newErrors.otp = "OTP is required";
      setErrors(newErrors);
    } else if (!validOTP.test(formData.otp)) {
      newErrors.otp = "OTP must be 6 digits long";
      setErrors(newErrors);
    } else {
      setErrors({});
      setIsSubmitting(true);
      try {
        await axiosInstance.post("/auth/number/verifyotp", {
          phoneNumber: formData.phoneNumber,
          otp: formData.otp,
        });
        checkAuthStatus();
        toast.success("OTP Verified");
        navigate("/welcome");
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

  if (loading) return <Loading />;

  return (
    <>
      <Intro page={isRegister ? "Sign Up" : "Sign In"} />
      <section className="login-form page-section-ptb bg-overlay-black-30">
        <Container>
          <Row className="justify-content-center">
            <Col lg={6}>
              <div className="login-form-inner clearfix text-center">
                <h4 className="title divider text-white">
                  {isRegister ? "SIGN UP" : "SIGN IN"}
                </h4>
                <div className="login-social my-4 my-md-5 text-center clearfix">
                  <ul className="list-inline text-capitalize">
                    <li>
                      <Link
                        className="align-items-center d-flex otp justify-content-center"
                        to={isRegister ? "/register" : "/login"}
                      >
                        <i className="fa fa-user"></i>{" "}
                        {isRegister ? "Sign Up" : "Sign In"} With Email
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="align-items-center d-flex google justify-content-center"
                        to={`${process.env.REACT_APP_API_URL}/api/auth/google/login`}
                      >
                        <i className="fa fa-google"></i>{" "}
                        {isRegister ? "Sign Up" : "Sign In"} With google
                      </Link>
                    </li>
                  </ul>
                </div>
                <form
                  noValidate
                  onSubmit={isOtpSent ? handleVerifyOtp : handleSendOtp}
                >
                  {!isOtpSent && (
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
                          disabled={isOtpSent}
                          autoComplete="tel"
                        />
                      </div>
                      {errors.phoneNumber && (
                        <div className="error">{errors.phoneNumber}</div>
                      )}
                    </div>
                  )}
                  {isOtpSent && (
                    <div className="section-field mb-3">
                      <div className="field-widget">
                        <i className="fa fa-key"></i>
                        <input
                          id="otp"
                          type="number"
                          placeholder="otp"
                          name="otp"
                          value={formData.otp}
                          onChange={handleChange}
                          autoComplete="one-time-code"
                        />
                      </div>
                      {errors.otp && <div className="error">{errors.otp}</div>}
                    </div>
                  )}
                  <div className="section-field">
                    <Link
                      to="./"
                      className="float-end text-white text-decoration-none text-uppercase"
                      onClick={ResentOTP}
                    >
                      Resend OTP
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
                        {isOtpSent ? "Verify OTP" : "Send OTP"}
                        <i className="fa fa-arrow-right" aria-hidden="true"></i>
                      </span>
                    </button>
                  </div>
                  <div className="clearfix"></div>
                </form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default LoginPhone;
