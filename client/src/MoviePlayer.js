import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";

const socket = io(process.env.REACT_APP_SERVER_URL);

const MoviePlayer = () => {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const[seeking,setSeeking]=useState(false)
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
    if (videoRef.current && playing) {
      const currentTime = videoRef.current.currentTime;
      setPlaying(false);
      console.log(`vedio is paused from ${currentTime}`);
      socket.emit("pause", currentTime);
    }
  };

  const handleSeeking = () => {
    if (videoRef.current && seeking) {
      const currentTime = videoRef.current.currentTime;
      setPlaying(false);
      videoRef.current.pause(); // Play the video
      socket.emit("pause", currentTime);
    }
  };
  const handleSeeked = () => {
    if (videoRef.current && playing===false) {
      setPlaying(true);

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
        videoElement.addEventListener("seeked", handleSeeked);
        videoElement.addEventListener("seeking", handleSeeking);
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
        videoRef.current.removeEventListener("seeked", handleSeeked);
        videoRef.current.removeEventListener("seeking", handleSeeking);
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
              controls
              src={process.env.REACT_APP_MEDIA_URL}
              style={{ width: "100%", borderRadius: "10px" }}
            />
          </div>
        )}
      </Card>
    </Container>
  );
};

export default MoviePlayer;
