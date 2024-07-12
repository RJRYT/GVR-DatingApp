import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { AuthContext } from "../../contexts/AuthContext";

const DashBoard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (
    !localStorage.getItem("token") ||
    localStorage.getItem("token") === "undefined"
  )
    navigate("/login");

  return (
    <Container className="bg-white text-dark py-3 pb-5 text-center">
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <h2 className="text-dark fa-4x">Dating Dashboard</h2>
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

export default DashBoard;
