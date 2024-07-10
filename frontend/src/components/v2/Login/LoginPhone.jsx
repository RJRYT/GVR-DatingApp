import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../Instance/Axios";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { AuthContext } from "../../../contexts/AuthContext";
import Intro from "../Intro/Intro";

const LoginPhone = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();
  const { user, addToken } = useContext(AuthContext);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/auth/number/sendotp", { phoneNumber });
      setIsOtpSent(true);
    } catch (err) {
      console.error(err);
      alert(err.response.data.message);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (user) {
        navigate("/home");
        return;
      }
    };
    fetchUser();
  }, [navigate]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/auth/number/verifyotp", {
        phoneNumber,
        otp,
      });
      addToken(res.data.token);
      navigate("/home");
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data.message || "Something Broken..! Try again later"
      );
    }
  };

  return (
    <>
      <Intro page="Login" />
      <Container>
        <Row className="justify-content-md-center">
          <Col xs={12} md={6}>
            <h2>Login with Phone Number</h2>
            <Form onSubmit={isOtpSent ? handleVerifyOtp : handleSendOtp}>
              <Form.Group controlId="formBasicPhoneNumber">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={isOtpSent}
                />
              </Form.Group>

              {isOtpSent && (
                <Form.Group controlId="formBasicOtp">
                  <Form.Label>OTP</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </Form.Group>
              )}

              <Button className="m-3" variant="primary" type="submit">
                {isOtpSent ? "Verify OTP" : "Send OTP"}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default LoginPhone;
