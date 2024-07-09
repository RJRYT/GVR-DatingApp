import React from 'react';
import { Container } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="py-3 mt-5">
      <Container>
        <p className="text-center">
          &copy; {new Date().getFullYear()} Dating App
        </p>
      </Container>
    </footer>
  );
}

export default Footer;