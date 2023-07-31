import React, { useRef, useEffect } from 'react'
const VideoPlayer = ({stream, classNames, onClick}) => {
  const videoRef = useRef(null);
  useEffect(() => {
    if (videoRef.current){
      videoRef.current.srcObject = stream;
    }
  })
  return (
    <video onClick={onClick} ref={videoRef} className={classNames} autoPlay muted></video>
  )
}

export default VideoPlayer
