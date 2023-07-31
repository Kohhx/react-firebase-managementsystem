import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import { useAuthContext } from "../hooks/useAuthContext";
import { IconName } from "react-icons/md";

const Sidebar = () => {
  const { user } = useAuthContext();
  console.log(user);
  return (
    <div class="sidebar">
      <div className="mt-7 text-center">
        <img
          className="object-cover rounded-full h-[6rem] w-[6rem] mx-auto mb-4"
          src={
            user.photoURL ||
            "https://wallpapers.com/images/hd/cool-profile-picture-87h46gcobjl5e4xu.jpg"
          }
          alt=""
        />
        <p className="font-bold text-sm">Welcome, {user && user.displayName}</p>
      </div>
      <nav className="mt-5">
        <ul>
          <li className="p-2 pl-3 hover:bg-red-400">
            <NavLink to="/">Dashboard</NavLink>
          </li>
          <li className="p-2 pl-3 hover:bg-red-400">
            <NavLink to="/create">New Project</NavLink>
          </li>
          <li className="p-2 pl-3 hover:bg-red-400">
            <NavLink to="/gallery">Gallery</NavLink>
          </li>
          <li className="p-2 pl-3 hover:bg-red-400">
            <NavLink to="/calendar">Calendar</NavLink>
          </li>
          <li className="p-2 pl-3 hover:bg-red-400">
            <NavLink to="/quiz">Quiz</NavLink>
          </li>
          <li className="p-2 pl-3 hover:bg-red-400">
            <NavLink to="/editor">Editor</NavLink>
          </li>
          <li className="p-2 pl-3 hover:bg-red-400">
            <NavLink to="/chatroom">Chatroom</NavLink>
          </li>
          <li className="p-2 pl-3 hover:bg-red-400">
            <NavLink to="/parse">Parse</NavLink>
          </li>
          <li className="p-2 pl-3 hover:bg-red-400">
            <NavLink to="/video-call">Video Call</NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
