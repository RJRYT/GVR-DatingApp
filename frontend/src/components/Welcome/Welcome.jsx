import React, { useState, useEffect } from "react";
import axiosInstance from "../../Instance/Axios";
import { useNavigate } from "react-router-dom";
import Intro from "../Intro/Intro";
import Section1 from "./Section1/Section1";
import Section2 from "./Section2/Section2";
import Section3 from "./Section3/Section3";
import "./Welcome.css";

function Welcome() {
  const [step, setStep] = useState(1);
  const [purposeType, setpurposeType] = useState("");
  const [completedSteps, setCompletedSteps] = useState({
    personalInfoSubmitted: false,
    professionalInfoSubmitted: false,
    purposeSubmitted: false,
  });
  const navigate = useNavigate();

  if (!localStorage.getItem("token") || localStorage.getItem("token") === "undefined")
    navigate("/login");

  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      try {
        const res = await axiosInstance.get("/users/status/registration");
        setCompletedSteps(res.data);
        if (!res.data.personalInfoSubmitted) setStep(1);
        else if (!res.data.professionalInfoSubmitted) setStep(2);
        else if (!res.data.purposeSubmitted) setStep(3);
        else{
          navigate("/home/dating");
          //Now im redirecting user to /home page. 
          //Then we can check user's purpose(short term / long term) and redirect according to it.
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchRegistrationStatus();
  });

  const handleNextStep = () => {
    if (step === 1) {
      setCompletedSteps({ ...completedSteps, personalInfoSubmitted: true });
    } else if (step === 2) {
      setCompletedSteps({ ...completedSteps, professionalInfoSubmitted: true });
    }
    setStep(step + 1);
  };

  const handleComplete = () => {
    setCompletedSteps({ ...completedSteps, purposeSubmitted: true });
    if (purposeType === "shortTermRelationShip") navigate("/home/dating"); //redirecting to dating app dashboard
    //add others here
    else navigate("/home");
  };

  return (
    <>
      <Intro page="Welcome" />
      {step === 1 && !completedSteps.personalInfoSubmitted && (
        <Section1 onNext={handleNextStep} />
      )}
      {step === 2 && !completedSteps.professionalInfoSubmitted && (
        <Section2 onNext={handleNextStep} />
      )}
      {step === 3 && !completedSteps.purposeSubmitted && (
        <Section3 onComplete={handleComplete} setPurpose={setpurposeType} />
      )}
    </>
  );
}

export default Welcome;
