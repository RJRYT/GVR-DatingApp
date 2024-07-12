import React from "react";
import { Outlet } from "react-router-dom";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";

function Layout() {

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
