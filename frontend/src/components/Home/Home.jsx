import React, { useEffect, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { AuthContext } from "../../contexts/AuthContext";
import AccessDenied from "../AccessDenied/AccessDenied";
import Loading from "../Loading/Loading";

const Home = () => {
  const { authState, checkAuthStatus, loading } = useContext(AuthContext);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      checkAuthStatus();
    }
  }, []);

  if (loading) return <Loading />;

  if (!loading && !authState.isAuthenticated) return <AccessDenied />;

  return (
    <Container className="bg-white text-dark py-3 pb-5 text-center">
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <h2 className="text-dark fa-4x">Default Dashboard</h2>
          {authState.user ? (
            <div>
              <h3 className="text-dark">Welcome, {authState.user.username}</h3>
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
