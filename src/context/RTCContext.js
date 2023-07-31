import React, { createContext, useState, useEffect, useReducer } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router";
import { Peer } from "peerjs";
import { v4 as uuidv4 } from "uuid";
import { peerReducer } from "../reducers/peerReducer";
import { addPeerAction, removePeerAction } from "../reducers/peerAction";

export const WebRTCContext = createContext();

const socketURL = "http://localhost:5000";
const ws = io(socketURL);

const RTCContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [peer, setPeer] = useState(null);
  const [stream, setStream] = useState(null);
  const [peers, dispatch] = useReducer(peerReducer, {});
  const [roomId, setRoomId] = useState(null);
  const [screenSharingId, setScreenSharingId] = useState("");
  const [lastScreenSharingId, setLastScreenSharingId] = useState("");

  console.log({ screenSharingId });

  const switchScreenSharing = (stream) => {
    setStream(stream);
    setScreenSharingId(peer?.id || "");
    Object.values(peer?.connections).forEach((connection) => {
      const videoTrack = stream
        ?.getTracks()
        .find((track) => track.kind === "video");
      connection[0].peerConnection
        .getSenders()[1]
        .replaceTrack(videoTrack)
        .catch((err) => console.log(err));
    });
  };

  const shareScreen = () => {
    console.log("Screen sharing ...");
    console.log( "ScreenSharin ID: ", screenSharingId )
    if (screenSharingId) {
      console.log("Video sharing");
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(switchScreenSharing).then(() => { setScreenSharingId("")})
        .catch((err) => console.error(err));
    } else {
      console.log("screen sharing");
      const mediaDevices = navigator.mediaDevices;
      mediaDevices
        .getDisplayMedia({})
        .then(switchScreenSharing).then(() => { setScreenSharingId(peer._id)})
        .catch((err) => console.error(err));

      // ws.emit("start-sharing", { peerId: screenSharingId, roomId });
    }
  };

  const enterRoom = ({ roomId }) => {
    console.log({ roomId });
    navigate(`/video-call/${roomId}`);
  };

  const onCam = () => {
    try {
      console.log("eeee....");
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setStream(stream);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const offCam = () => {
    if (!stream) return;
    console.log("Stopping cam");
    const tracks = stream.getTracks();
    // Or stop all like so:
    tracks.forEach((track) => track.stop());
    setStream(null);
  };

  const handleUserList = ({ participants }) => {
    participants.map((peerId) => {
      const call = stream && peer?.call(peerId, stream);
      console.log("call", call);
      call?.on("stream", (userVideoStream) => {
        console.log({ addPeerAction });
        dispatch(addPeerAction(peerId, userVideoStream));
      });
    });
  };

  const removePeer = (peerId) => {
    dispatch(removePeerAction(peerId));
  };

  useEffect(() => {
    const peer = new Peer(uuidv4());
    setPeer(peer);

    ws.on("room-created", enterRoom);
    ws.on("get-users", handleUserList);
    ws.on("user-disconnected", removePeer);
    ws.on("user-started-sharing", (peerId) => {
      // if (peerId === screenSharingId) return;
      console.log("Started Sharing");
      setLastScreenSharingId(peerId)
    });
    ws.on("user-stopped-sharing", () => setScreenSharingId(""));

    return () => {
      ws.off("room-created");
      ws.off("get-users");
      ws.off("user-disconnected");
      ws.off("user-started-sharing");
      ws.off("user-stopped-sharing");
    };
  }, []);

  // useEffect(() => {
  //   if (screenSharingId) {
  //     console.log("start sharing");
  //     ws.emit("start-sharing", { peerId: screenSharingId, roomId });
  //   } else {
  //     ws.emit("stop-sharing", { peerId: screenSharingId, roomId });
  //   }
  // }, [screenSharingId, roomId]);

  useEffect(() => {
    if (!peer) return;
    if (!stream) return;
    console.log("peering started");

    ws.on("user-joined", ({ peerId }) => {
      console.log("user joined", peerId);
      console.log("peer", peer);
      const call = stream && peer.call(peerId, stream);
      console.log("call", call);
      if (!call) {
        console.log("call not found");
        return;
      }
      console.log("call found");
      console.log("Streamm", stream);
      call.on("stream", (peerStream) => {
        console.log("Stream sent");
        dispatch(addPeerAction(peerId, peerStream));
      });
    });

    peer.on("call", (call) => {
      call.answer(stream);
      call.on("stream", (peerStream) => {
        console.log("Stream received");
        dispatch(addPeerAction(call.peer, peerStream));
      });
    });
  }, [peer, stream]);

  console.log({ peers });

  return (
    <WebRTCContext.Provider
      value={{
        ws,
        peer,
        stream,
        peers,
        onCam,
        offCam,
        shareScreen,
        setRoomId,
        screenSharingId,
      }}
    >
      {children}
    </WebRTCContext.Provider>
  );
};

export default RTCContextProvider;
