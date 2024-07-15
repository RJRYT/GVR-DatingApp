import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

function AccessDenied() {
  return (
    <Container>
      <Row className="justify-content-center">
        <Col lg={6}>
          <div className="d-flex clearfix align-content-center align-items-center justify-content-center flex-column">
            <h3 className="text-white pt-5">Access Denied...</h3>
            <p className="text-white pt-3">
              You are not allowed to acces this page now. Please{" "}
              <Link className="text-white" to="/login">
                Login
              </Link>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default AccessDenied;
