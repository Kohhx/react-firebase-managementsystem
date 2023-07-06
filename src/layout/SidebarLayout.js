import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const SidebarLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="grow">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
};

export default SidebarLayout;
