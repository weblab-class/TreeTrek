import socketIOClient from "socket.io-client";
import { post } from "./utilities";
const endpoint = window.location.hostname + ":" + window.location.port;
export const socket = socketIOClient(endpoint);
socket.on("connect", () => {
  post("/api/initsocket", { socketid: socket.id });
});

/** send a message to the server with the move you made in game */
export const move = (dir) => {
  socket.emit("move", dir);
};

export const avatarPlayer = (avatar) => {
  socket.emit("avatarPlayer", avatar);
};

export const readyPlayer = (ready) => {
  socket.emit("readyPlayer", ready);
};

export const prepLobbyGame = () => {
  socket.emit("prepLobbyGame");
};
