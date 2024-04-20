const createError = require('http-errors');
const express = require('express');
const socket = require('socket.io');
const {Server} = require("socket.io");
const http = require("http");

const app = express();
app.set("port", process.env.PORT || 3001);

app.use(express.json());

const arr = []

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    }
});

io.on("connection", (socket) => {
    io.emit("message", arr);
    socket.on('connect', () => {
        console.log('connected to server');
    })
    socket.on("message", (message) => {
        console.log(message);
        arr.push({
            content: message
        });
        io.emit('message', arr);
    });
});

server.listen(app.get("port"), () => {
    console.log(`🏇${app.get("port")}에서 서버가 실행중입니다!🚴🏻  `)
});