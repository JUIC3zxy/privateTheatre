import dgram from "dgram"; // Although not used, this replaces `require("dgram")`
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import * as dotenv from "dotenv";
dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3003;
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
const io = new Server(server, {
  cors: {
    origin: frontendUrl, // Your frontend's address
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: frontendUrl, // Your frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  })
);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("play", (time) => {
    console.log(`Received "play" event from a client at time: ${time}s`);
    socket.broadcast.emit("play", time);
    console.log(`Broadcasted "play" event to other clients`);
  });

  socket.on("pause", (time) => {
    socket.broadcast.emit("pause", time);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(3003, () => {
  console.log("server is running on 3003");
});
