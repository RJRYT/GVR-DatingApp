import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Instance/Axios";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { AuthContext } from "../../contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { user, addToken } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      if (user) {
        navigate("/home");
        return;
      }
    };
    fetchUser();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/auth/email/login", {
        email,
        password,
      });
      addToken(res.data.token);
      navigate("/home");
    } catch (err) {
      console.error(err);
      alert(err.response.data.message);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = process.env.REACT_APP_API_URL+"/api/auth/google/login";
  };

  const handlePhoneLogin = () => {
    navigate("/login/phone");
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <h2>Login</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button className="m-3" variant="primary" type="submit">
              Login
            </Button>
          </Form>
          <Button variant="danger" onClick={handleGoogleLogin} className="m-3">
            Login with Google
          </Button>

          <Button
            variant="secondary"
            onClick={handlePhoneLogin}
            className="m-3"
          >
            Login with Phone Number
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
