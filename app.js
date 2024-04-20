const createError = require('http-errors');
const express = require('express');
const socket = require('socket.io');
const {Server} = require("socket.io");
const http = require("http");

const app = express();
app.set("port", process.env.PORT || 3001);

app.use(express.json());

/**
 * id: str(UUID)
 */
const onlineUser = [];
let count = 0;

/**
 * message: str
 * id: str(UUID)
 */
const chatDB = []

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    }
});

io.on("connection", (socket) => {
    io.emit("message", chatDB);
    socket.emit('count', onlineUser.length);
    socket.on('연결', (message) => {
        const id = message.id
        if (!onlineUser.filter(e => e.id === id).length) {
            onlineUser.push({
                id
            });
        }
        count++;
        console.log(onlineUser);
        socket.emit('count', onlineUser.length);
    });
    socket.on("message", (message) => {
        console.log(message);
        chatDB.push({
            content: message
        });
        socket.emit('message', chatDB);
    });
    socket.on('disconnect', () => {
        console.log('끝');
        count--;
    });
});

server.listen(app.get("port"), () => {
    console.log(`🏇${app.get("port")}에서 서버가 실행중입니다!🚴🏻  `)
});