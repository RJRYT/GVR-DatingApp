import React from "react";
import Intro from "../Intro/Intro";
import Section1 from "./Section1/Section1";
import "./Welcome.css";

function Welcome() {
  return (
    <>
      <Intro page="Welcome" />
      <Section1 />
    </>
  );
}

export default Welcome;
