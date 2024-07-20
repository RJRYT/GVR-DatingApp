import React, { useEffect, useContext } from "react";
import { Container, Row, Col, Badge } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import AccessDenied from "../AccessDenied/AccessDenied";
import Loading from "../Loading/Loading";

const Home = () => {
  const { authState, checkAuthStatus, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      checkAuthStatus();
      navigate("/welcome");
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
              <Row>
                <Col xs={12}>Email: {authState.user.email}</Col>
                <Col xs={12}>
                  Verify Status:{" "}
                  {authState.user.emailVerified ? (
                    <Badge className="text-white bg-primary">Verified</Badge>
                  ) : (
                    <Badge className="text-white bg-danger">Pending</Badge>
                  )}
                </Col>
                <Col xs={12}>
                  Login with google:{" "}
                  {authState.user.googleId ? (
                    <Badge className="text-white bg-primary">Enabled</Badge>
                  ) : (
                    <Badge className="text-white bg-danger">Disabled</Badge>
                  )}
                </Col>
                <Col xs={12}>
                  Registration Status:{" "}
                  {authState.user.personalInfoSubmitted &&
                  authState.user.professionalInfoSubmitted &&
                  authState.user.purposeSubmitted ? (
                    <Badge className="text-white bg-primary">Completed</Badge>
                  ) : (
                    <Link className="text-decoration-none" to={"/welcome"}>
                      <Badge className="text-white bg-warning">Pending</Badge>{" "}
                      Complete it
                    </Link>
                  )}
                </Col>
              </Row>
              <hr />
              {authState.user.personalInfoSubmitted && (
                <Row>
                  <Col xs={12}>Gender: {authState.user.gender}</Col>
                  <Col xs={12}>Location: {authState.user.location}</Col>
                  <Col xs={12}>
                    hobbies:{" "}
                    {authState.user.hobbies.map((hby) => hby.label).join(", ")}
                  </Col>
                  <Col xs={12}>
                    interests:{" "}
                    {authState.user.interests
                      .map((intst) => intst.label)
                      .join(", ")}
                  </Col>
                  <Col xs={12}>
                    smoking Habits: {authState.user.smokingHabits}
                  </Col>
                  <Col xs={12}>
                    drinking Habits: {authState.user.drinkingHabits}
                  </Col>
                  <Col xs={12}>
                    qualification:{" "}
                    {authState.user.qualification
                      .map((qua) => qua.label)
                      .join(", ")}
                  </Col>
                </Row>
              )}
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
