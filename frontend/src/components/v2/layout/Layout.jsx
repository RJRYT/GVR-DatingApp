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
    <div className="bg-black text-white">
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
