import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";

const socket = io("http://localhost:3003");

const MoviePlayer = () => {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [handleStart, setHandleStart] = useState(false);

  const handlePlay = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      setPlaying(true);
      console.log(`vedio is playing from ${currentTime}`);
      socket.emit("play", currentTime);
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      setPlaying(false);
      console.log(`vedio is paused from ${currentTime}`);
      socket.emit("pause", currentTime);
    }
  };

  const handleSeek = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      console.log(`vedio is playing from ${currentTime}`);
    }
  };

  useEffect(() => {
    if (!handleStart) return;

    socket.on("play", (time) => {
      console.log(`Received "play" event at ${time}s`);
      if (videoRef.current) {
        videoRef.current.currentTime = time; // Sync the current playback time
        videoRef.current.play(); // Play the video
      }
    });

    socket.on("pause", (time) => {
      console.log(`Received "pause" event at ${time}s`);
      if (videoRef.current) {
        videoRef.current.currentTime = time; // Sync the current playback time
        videoRef.current.pause(); // Pause the video
      }
    });

    const addEventListeners = () => {
      const videoElement = videoRef.current;
      if (videoElement) {
        console.log("Video element found, adding event listeners");
        videoElement.addEventListener("play", handlePlay);
        videoElement.addEventListener("pause", handlePause);
        videoElement.addEventListener("seeked", handleSeek);
      } else {
        console.log("vedio element is null!");
      }
    };

    if (videoRef.current) {
      videoRef.current.addEventListener("loadedmetadata", addEventListeners);
    }

    return () => {
      // Clean up event listeners
      socket.off("play");
      socket.off("pause");
      if (videoRef.current) {
        videoRef.current.removeEventListener("play", handlePlay);
        videoRef.current.removeEventListener("pause", handlePause);
        videoRef.current.removeEventListener("seeked", handleSeek);
        videoRef.current.removeEventListener(
          "loadedmetadata",
          addEventListeners
        );
      }
    };
  }, [handleStart]);

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card
        className="shadow-lg p-4"
        style={{ maxWidth: "800px", width: "100%" }}
      >
        <h3 className="text-center mb-4">Movie Player</h3>
        {!handleStart && (
          <Button
            onClick={() => {
              setHandleStart(true);
            }}
          >
            start
          </Button>
        )}
        {handleStart && (
          <div className="video-container mb-3">
            <video
              ref={videoRef}
              src="https://pan.mdsub.top/api/raw?path=/%E5%B8%83%E6%8B%89%E5%BE%B7%E5%B0%BC%E5%88%A9%E7%A5%9E%E7%BB%8F%E7%A7%80/%E5%B8%83%E6%8B%89%E5%BE%B7%E5%B0%BC%E5%88%A9%E7%A5%9E%E7%BB%8F%E7%A7%80.Brad.Neelys.Harg.Nallin.Sclopio.Peepio.S01E01.WEB-720p.1280X720.%E4%B8%AD%E8%8B%B1%E5%8F%8C%E8%AF%AD-%E7%94%B5%E6%B3%A2%E5%AD%97%E5%B9%95%E7%BB%84.mp4"
              controls
              style={{ width: "100%", borderRadius: "10px" }}
            />
          </div>
        )}
      </Card>
    </Container>
  );
};

export default MoviePlayer;
