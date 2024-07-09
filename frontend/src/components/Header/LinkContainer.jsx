import React from 'react';
import { useNavigate } from "react-router-dom";
import { Nav } from 'react-bootstrap';

const LinkContainer = ({ to, children }) => {
  let navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    navigate(to);
  };

  return (
    <Nav.Link href={to} onClick={handleClick}>
      {children}
    </Nav.Link>
  );
};

export default LinkContainer;
