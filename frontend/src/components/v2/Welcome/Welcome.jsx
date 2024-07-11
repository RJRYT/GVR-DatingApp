import React, { useState } from "react";
import Intro from "../Intro/Intro";
import Section1 from "./Section1/Section1";
import Section2 from "./Section2/Section2";
import Section3 from "./Section3/Section3";
import "./Welcome.css";

function Welcome() {

  const [step, setStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState({
    personalInfo: false,
    professionalInfo: false,
    purpose: false,
  });

  const handleNextStep = () => {
    if (step === 1) {
      setCompletedSteps({ ...completedSteps, personalInfo: true });
    } else if (step === 2) {
      setCompletedSteps({ ...completedSteps, professionalInfo: true });
    }
    setStep(step + 1);
  };

  const handleComplete = () => {
    setCompletedSteps({ ...completedSteps, purpose: true });
    // Redirect to home
    window.location.href = '/home';
  };

  return (
    <>
      <Intro page="Welcome" />
      {step === 1 && !completedSteps.personalInfo && (
        <Section1 onNext={handleNextStep} />
      )}
      {step === 2 && !completedSteps.professionalInfo && (
        <Section2 onNext={handleNextStep} />
      )}
      {step === 3 && !completedSteps.purpose && (
        <Section3 onComplete={handleComplete} />
      )}
    </>
  );
}

export default Welcome;
