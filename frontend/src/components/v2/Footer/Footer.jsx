import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Footer.css";

function Footer() {
  return (
    <footer className="py-3 mt-5 text-white text-center">
      <div className="footersection">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <div className="mb-2">
                <img
                  className="img-center"
                  src="/images/logo.png"
                  alt="Logo"
                  width="75px"
                />
              </div>
              <div className="color-hover social-icons">
                <ul>
                  <li className="social-facebook">
                    <a href="#">
                      <i className="fa fa-facebook"></i>
                    </a>
                  </li>
                  <li className="social-twitter">
                    <a href="#">
                      <i className="fa fa-twitter"></i>
                    </a>
                  </li>
                  <li className="social-dribbble">
                    <a href="#">
                      <i className="fa fa-dribbble"></i>
                    </a>
                  </li>
                  <li className="social-gplus">
                    <a href="#">
                      <i className="fa fa-google-plus"></i>
                    </a>
                  </li>
                  <li className="social-youtube">
                    <a href="#">
                      <i className="fa fa-youtube"></i>
                    </a>
                  </li>
                </ul>
              </div>
              <p className="text-center text-white">
                &copy; {new Date().getFullYear()} - Dating App All Right
                Reserved
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
}

export default Footer;
