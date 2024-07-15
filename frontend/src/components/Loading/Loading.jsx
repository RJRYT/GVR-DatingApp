import React from 'react';
import { Container, Row, Col } from "react-bootstrap";

function Loading() {
  return (
    <Container>
      <Row className="justify-content-center">
        <Col lg={6}>
          <div className="d-flex clearfix align-content-center align-items-center justify-content-center">
            <h3 className='text-white'>Loading...</h3>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Loading;