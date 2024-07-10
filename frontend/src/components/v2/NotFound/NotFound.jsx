import React from "react";
import "./NotFound.css";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="page-section-ptb text-center clearfix error-page position-relative bg-white text-dark">
      <Container>
        <Row className="justify-content-start">
          <Col lg={7} md={12}>
            <div className="big-title">404</div>
            <h3 className="title mb-4 sm-mb-3 text-dark">
              <b>This is Awkward</b>
            </h3>
            <p className="lead">
              Think back over your life. Think about the people that had a
              positive influence on you. If your past was like mine, many of
              them didn’t realize the impact they made. The influence was
              usually due to them caring about you and doing some little thing.
              What little things have been done for you that changed your life?
              What little things have you done for someone else that might have
              changed theirs?
            </p>
            <Link to="/home" className="button btn-lg btn-theme full-rounded animated right-icn mt-4 text-decoration-none">
              <span>
                Go to Home page
                <i className="fa fa-heart" aria-hidden="true"></i>
              </span>
            </Link>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default NotFound;
