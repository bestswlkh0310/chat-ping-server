const createError = require('http-errors');
const express = require('express');
const socket = require('socket.io');
const {Server} = require("socket.io");
const http = require("http");
const {getRandomInt} = require("./util");

const app = express();
app.set("port", process.env.PORT || 3001);

app.use(express.json());

/**
 * key: id: str(UUID)
 * value:
 * - lastActive: Date
 */
const onlineUser = {};
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

    // 온라인 유저 받아오기
    socket.on('online', (id) => {
        // 온라인 유저 저장
        if (!onlineUser[id]) {
            onlineUser[id] = {
                lastActive: Date.now(),
                isChatting: false
            };
        } else {
            onlineUser[id].lastActive = Date.now();
        }
        console.log(`User [ ${id} ] 가 온라인입니다.`);

        // 온라인 유저 개수 반환
        const count = Object.keys(onlineUser).length
        socket.emit('online', count);
    });
});

app.get("/match/:id", (req, res) => {
    const {matchId} = req.params;
    const users = Object.keys(onlineUser).filter(id => !onlineUser[id].isChatting && id !== matchId) // 채팅 안 하고 있는 유저 불러오기
    const matchedUser = onlineUser[getRandomInt(users.length - 1)];

});

app.delete('/match/:id', (req, res) => {
    const {id}= req.params;
    console.log(id);
})


// 세션이 만료된 유저 핸들링
setInterval(() => {
    const currentTime = Date.now();
    Object.keys(onlineUser).forEach((id) => {
        if (currentTime - onlineUser[id].lastActive > 6_000) {
            delete onlineUser[id];
            console.log(`User [ ${id} ] 가 오프라인입니다.`);
        }
    });
}, 2000);

server.listen(app.get("port"), () => {
    console.log(`🏇${app.get("port")}에서 서버가 실행중입니다!🚴`);
});