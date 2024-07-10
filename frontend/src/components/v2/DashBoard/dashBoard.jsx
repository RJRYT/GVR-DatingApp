import React, { useEffect, useContext } from "react";
import axiosInstance from "../../../Instance/Axios";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { AuthContext } from "../../../contexts/AuthContext";

const DashBoard = () => {
  const { user, login, addToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    console.log("Token: ", token);
    if (token) {
      addToken(token);
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      console.log("User: ", user);
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const res = await axiosInstance.get("/users/me");
        login(res.data);
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <h2>Dashboard</h2>
          {user ? (
            <div>
              <h3>Welcome, {user.username}</h3>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default DashBoard;
