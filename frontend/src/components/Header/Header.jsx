import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap";
import LinkContainer from "./LinkContainer";
import { AuthContext } from "../../contexts/AuthContext";

function Header() {
  const { user, logout } = useContext(AuthContext);
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/home">
          Dating App
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <LinkContainer to="/home">Dashboard</LinkContainer>
            {!user ? (
              <>
                <LinkContainer to="/login">Login</LinkContainer>
                <LinkContainer to="/register">Register</LinkContainer>
              </>
            ) : (
              <>
                <LinkContainer to="/profile">Profile</LinkContainer>
                <LinkContainer to="#logout">
                  <Nav.Item onClick={logout}>
                    Logout
                  </Nav.Item>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
