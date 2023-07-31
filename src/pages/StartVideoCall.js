import React, { useEffect, useContext } from 'react'
import { WebRTCContext } from '../context/RTCContext'
import { useNavigate } from 'react-router';
import { Peer } from "peerjs";
import { v4 as uuidv4 } from 'uuid';

const StartVideoCall = () => {
  const navigate = useNavigate();
  const { ws, peer } = useContext(WebRTCContext);

  const handleCreateRoom = () => {
    ws.emit("create-room", { peerId: peer._id });
  }
  return (
    <div className="flex justify-center items-center h-[80vh]">
      <button onClick={handleCreateRoom} className="rounded-lg bg-pink-600 px-5 py-2 text-white hover:bg-pink-500">Start Meeting</button>
    </div>
  )
}

export default StartVideoCall
