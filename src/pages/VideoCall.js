import React, { useEffect, useContext, useState } from "react";
import { useParams } from "react-router";
import { WebRTCContext } from "../context/RTCContext";
import VideoPlayer from "../components/VideoPlayer";
import { LuScreenShare } from "react-icons/lu";
import "./VideoCall.css";

const VideoCall = () => {
  const { ws, stream, peer, peers, onCam, offCam, shareScreen, setRoomId, screenSharingId } =
    useContext(WebRTCContext);
  const { roomId } = useParams();
  const [mainPeer, setMainPeer] = useState(stream);

  useEffect(() => {
    onCam();
    peer?.on("open", () => {
      ws.emit("join-room", { roomId, peerId: peer._id });
    });
    return () => offCam();
  }, [roomId, peer, ws]);

  useEffect(() => {
    setMainPeer(stream);
  }, [stream]);

  useEffect(() => {
    setRoomId(roomId)
  }, [roomId, setRoomId])

  useEffect(() => {
    if (screenSharingId) {
      console.log('SCREEN SHARE: ', Object.values(peers))
      // setMainPeer(peers[screenSharingId].stream)
    }
  },[screenSharingId])

  console.log("MainPeer", mainPeer);

  return (
    <div className="room-grid">
      <div className="main-video">
        <VideoPlayer stream={mainPeer} classNames={"w-full h-full"} />
      </div>
      <div className="video-list flex">
        <VideoPlayer
          onClick={() => setMainPeer(stream)}
          classNames={"max-w-full h-full m-0 inline cursor-pointer"}
          stream={stream}
        />
        {Object.values(peers).map((singlePeer) => {
          return (
            <VideoPlayer
              onClick={() => setMainPeer(singlePeer.stream)}
              classNames={"max-w-full h-full m-0 inline cursor-pointer"}
              key={singlePeer.peerId}
              stream={singlePeer.stream}
            />
          );
        })}
      </div>
      <div className="switch-cam flex items-center justify-center">
        <div className="bg-slate-400 p-3 rounded-xl">
          <LuScreenShare
            className="text-2xl cursor-pointer"
            onClick={() => shareScreen()}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
