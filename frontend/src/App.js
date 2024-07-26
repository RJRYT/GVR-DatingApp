import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Layout from "./components/layout/Layout";
import Home from "./components/Home/Home";
import DashBoard from "./components/DashBoard/DashBoard";
import Login from "./components/Login/Login";
import LoginPhone from "./components/Login/LoginPhone";
import Register from "./components/Register/Register";
import NotFound from "./components/NotFound/NotFound";
import Welcome from "./components/Welcome/Welcome";
import Profile from "./components/Profile/Profile";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <ToastContainer newestOnTop={true} theme="colored" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/login/phone" element={<LoginPhone />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home />} />
            <Route path="/home/dating" element={<DashBoard />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/profile" element={<Navigate to="/profile/@me" />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/api" element={<Navigate to="/api" />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
