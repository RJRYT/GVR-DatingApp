import React, { useEffect, useContext } from "react";
import axiosInstance from "../../../Instance/Axios";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { AuthContext } from "../../../contexts/AuthContext";

const Home = () => {
  const { user, login, addToken } = useContext(AuthContext);
  const navigate = useNavigate();

  if (
    !localStorage.getItem("token") ||
    localStorage.getItem("token") === "undefined"
  )
    navigate("/login");

  useEffect(() => {
    const fetchUser = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      if (token) {
        addToken(token);
        try {
          const res = await axiosInstance.get("/users/me");
          login(res.data);
          navigate("/welcome");
        } catch (err) {
          console.error(err);
          navigate("/login");
        }
      }
    };

    fetchUser();
  });

  return (
    <Container className="bg-white text-dark py-3 pb-5 text-center">
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <h2 className="text-dark fa-4x">Default Dashboard</h2>
          {user ? (
            <div>
              <h3 className="text-dark">Welcome, {user.username}</h3>
            </div>
          ) : (
            <p className="text-dark">Loading...</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
