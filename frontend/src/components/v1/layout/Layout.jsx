import React, { useEffect, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { AuthContext } from "../../../contexts/AuthContext";

function Layout() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else navigate("/home");
  }, [user]);
  return (
    <div>
      <header>
        <Header />
      </header>
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
