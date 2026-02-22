import { io } from "socket.io-client"

export const socket = io("https://courtisans-e6kg.onrender.com", {
    transports: ["websocket"]
})
