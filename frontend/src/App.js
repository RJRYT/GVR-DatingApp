import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/v2/layout/Layout";
import DashBoard from "./components/v2/DashBoard/dashBoard";
import Login from "./components/v2/Login/Login";
import LoginPhone from "./components/v2/Login/LoginPhone";
import Register from "./components/v2/Register/Register";
import NotFound from "./components/v2/NotFound/NotFound";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index path="/home" element={<DashBoard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login/phone" element={<LoginPhone />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
