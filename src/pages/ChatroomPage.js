import React, { useState, useEffect } from "react";
import "./ChatroomPage.css";
import { AiOutlineSearch } from "react-icons/ai";
import { useFirestoreUser } from "../hooks/useFirestoreUser";

const ChatroomPage = () => {
  const [chatGroupType, setChatGroupType] = useState("user");
  const [searchUser, setSearchUser] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const { getAllUsers, getUserBySearch } = useFirestoreUser("users");

  // const filterUsers = async (searchTerm) => {
  //   const results = await getUserBySearch(searchTerm);
  //   console.log(results);
  // };

  const filterUsers2 = (searchTerm) => {
    const results = users.filter((user) => {
      console.log("user",user);
      return (
        user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredUsers(results);
  };

  console.log("Filtered", filteredUsers);

  const getSetAllUsers = async () => {
    const results = await getAllUsers();
    setUsers(results);
  };

  useEffect(() => {
    getSetAllUsers();
  }, []);

  console.log(users);

  useEffect(() => {
    if (searchUser === "") {
      setFilteredUsers([]);
      return
    }
    if (users) {
      filterUsers2(searchUser);
    }
  }, [searchUser]);

  return (
    <div className="chatroom-container">
      <div className="chatroom-grid">
        <div className="leftbar-section">
          <div className="flex">
            <div
              onClick={() => setChatGroupType("user")}
              className={`w-[50%] text-center border-r-4 border-b-4 border-green-600 py-2 cursor-pointer hover:bg-yellow-300 ${
                chatGroupType === "user" && "font-bold"
              }`}
            >
              User Chat
            </div>
            <div
              onClick={() => setChatGroupType("group")}
              className={`w-[50%] text-center border-b-4 border-r border-green-600 py-2 cursor-pointer  hover:bg-yellow-300 ${
                chatGroupType === "group" && "font-bold"
              }`}
            >
              Group Chat
            </div>
          </div>

          <div className="relative mt-1">
            <div className="bg-white h-full relative w-[90%] flex items-center mx-auto">
              <AiOutlineSearch className="search-icon absolute left-1 top-[25%]" />
              <input
                value={searchUser}
                type="text"
                className="pl-6 py-1.5 border"
                onChange={(e) => setSearchUser(e.target.value)}
              />
            </div>
            <div className="absolute border w-[90%] mx-auto ml-[5%] bg-white">
              {filteredUsers.map((user) => (
              <div className="text-center px-1 py-1.5 border-b border-t-0">
                {user.displayName}
              </div>
              ))}
            </div>
          </div>

          <div>dedede</div>
        </div>
        <div className="header-section"></div>
        <div className="chat-section"></div>
        <div className="input-section"></div>
      </div>
    </div>
  );
};

export default ChatroomPage;
