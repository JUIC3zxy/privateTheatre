import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";



const MoviePlayer = () => {
    const videoRef = useRef(null);
  
    const handlePlay = () => {
      console.log("Video started playing");
      // Add your WebSocket emit logic here (e.g., socket.emit('play'))
    };
  
    const handlePause = () => {
      console.log("Video paused");
      // Add your WebSocket emit logic here (e.g., socket.emit('pause'))
    };
  
    const handleSeek = () => {
      const currentTime = videoRef.current.currentTime;
      console.log(`Video seeked to ${currentTime}s`);
      // Add WebSocket seek emit logic here if needed
    };
  
    useEffect(() => {
      const videoElement = videoRef.current;
  
      // Add event listeners for the video element
      videoElement.addEventListener("play", handlePlay);
      videoElement.addEventListener("pause", handlePause);
      videoElement.addEventListener("seeked", handleSeek); // Detect when user seeks using native controls
  
      return () => {
        // Clean up event listeners
        videoElement.removeEventListener("play", handlePlay);
        videoElement.removeEventListener("pause", handlePause);
        videoElement.removeEventListener("seeked", handleSeek);
      };
    }, []);
  
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Card className="shadow-lg p-4" style={{ maxWidth: "800px", width: "100%" }}>
          <h3 className="text-center mb-4">Movie Player</h3>
          <div className="video-container mb-3">
            <video
              ref={videoRef}
              src="/path-to-your-movie.mp4"
              controls
              style={{ width: "100%", borderRadius: "10px" }}
            />
          </div>
        </Card>
      </Container>
    );
  };
  
  export default MoviePlayer;