import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import ImageUpload from "./Upload/ImageUpload";
import ReelUpload from "./Upload/ReelUpload";

function Section1() {
  return (
    <section className="register-1-form register-img dark-bg page-section-ptb">
      <Container>
        <Row className="justify-content-center">
          <Col lg={6}>
            <div className="register-form-inner clearfix text-center">
              <h4 className="title divider text-white mb-3">
                Personal Details
              </h4>
              <div className="section-field mb-3">
                <div className="field-widget">
                  <i className="fa fa-user"></i>
                  <input id="Age" type="number" placeholder="Age" />
                </div>
              </div>
              <div className="section-field mb-3">
                <div className="field-widget">
                  <i className="fa fa-calendar"></i>
                  <input id="Dob" type="date" placeholder="date of birth" />
                </div>
              </div>
              <div className="section-field mb-3">
                <div className="field-widget">
                  <i className="fa fa-futbol-o" aria-hidden="true"></i>
                  <select id="hobbie" name="hobbie">
                    <option value="">Hobbies</option>
                    <option value="gaming">gaming</option>
                    <option value="sleeping">sleeping</option>
                  </select>
                </div>
              </div>
              <div className="section-field mb-3">
                <div className="field-widget">
                  <i className="fa fa-bullseye"></i>
                  <select id="interests" name="interests">
                    <option value="">Interests</option>
                    <option value="mornig tea">mornig tea</option>
                    <option value="traveling">traveling</option>
                  </select>
                </div>
              </div>
              <div className="section-field mb-3">
                <div className="field-widget">
                  <i className="fa fa-futbol-o"></i>
                  <select id="smoking" name="smoking">
                    <option value="">Smoking Habbits</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="planningToQuit">Planning To Quit</option>
                  </select>
                </div>
              </div>
              <div className="section-field mb-3">
                <div className="field-widget">
                  <i className="fa fa-beer" aria-hidden="true"></i>
                  <select id="drining" name="drining">
                    <option value="">Drinking Habbits</option>
                    <option value="regular">Regular</option>
                    <option value="planningToQuit">Planning To Quit</option>
                    <option value="socially">Socially</option>
                    <option value="occasionally">Occasionally</option>
                    <option value="teeToTaler">Teetotaler</option>
                  </select>
                </div>
              </div>
              <div className="section-field mb-3">
                <div className="field-widget">
                  <i className="fa fa-graduation-cap" aria-hidden="true"></i>
                  <input
                    id="qualification"
                    type="text"
                    placeholder="Qualifictions"
                  />
                </div>
              </div>
              <div className="section-field mb-3">
                <ImageUpload />
              </div>
              <div className="section-field mb-3">
                <ReelUpload />
              </div>
              <div className="clearfix"></div>
              <div className="section-field text-uppercase text-center mt-2">
                <Link
                  className="button  btn-lg btn-theme full-rounded animated right-icn text-decoration-none"
                  to="./"
                >
                  <span>
                    Next
                    <i className="fa fa-heart" aria-hidden="true"></i>
                  </span>
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Section1;
