import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap";
import LinkContainer from "./LinkContainer";
import { AuthContext } from "../../../contexts/AuthContext";
import "./Header.css";

function Header() {
  const { user, logout } = useContext(AuthContext);
  return (
    <Navbar bg="dark" expand="lg">
      <Container className="py-1">
        <Navbar.Brand as={Link} to="/home" className="colorwhite" style={{fontSize: "30px"}}>
          Dating App
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="togglebutton"
        />
        <Navbar.Collapse id="basic-navbar-nav" className="align-items-center justify-content-end">
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
                <LinkContainer to="./">
                  <Nav.Item onClick={logout}>Logout</Nav.Item>
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
