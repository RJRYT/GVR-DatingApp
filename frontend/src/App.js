import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/v1/layout/Layout";
import DashBoard from "./components/v1/DashBoard/dashBoard";
import Login from "./components/v1/Login/Login";
import LoginPhone from "./components/v1/Login/LoginPhone";
import Register from "./components/v1/Register/Register";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index path="/home" element={<DashBoard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/login/phone" element={<LoginPhone />} />
              <Route path="/register" element={<Register />} />
            </Route>
            <Route path="*" element={<div>404</div>} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
