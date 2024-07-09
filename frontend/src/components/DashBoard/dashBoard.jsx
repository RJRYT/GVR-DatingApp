import React, { useEffect, useState } from "react";
import axiosInstance from "../../Instance/Axios";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

const DashBoard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axiosInstance.get("/users/me");
        setUser(res.data);
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
