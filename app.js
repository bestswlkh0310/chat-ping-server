import express from "express";
import {Server} from "socket.io";
import http from "http";
import {onlineUser, roomList} from "./repository/Store.js";
import cors from "cors";
import Repository from "./repository/Repository.js";

const app = express();
app.set("port", process.env.PORT || 3001);
app.use(cors());
app.use(express.json());

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
        Repository.insertUser(id);
        socket.emit('online', onlineUser.length);
    });

    socket.on('cancel', (id) => {
        const room = Repository.getRoomById(id);
        if (room) {
            const {member1, member2} = room;
            io.emit("cancel", {
                member1,
                member2
            });
        }
        Repository.deleteRoomByUserId(id);
    });

    socket.on('message', (data) => {
        const {message, id} = data;
        const room = Repository.getRoomById(id);
        if (room) {
            const {member1, member2} = room;
            Repository.insertChat(room.id, id, message);
            const chatList = Repository.getChatListByRoomId(room.id)
            io.emit("message", {
                member1,
                member2,
                chatList
            });
        }
    });
});

app.post("/match/:id", (req, res) => {
    const {id} = req.params;
    let isMatched = false;
    const room = Repository.getRoomById(id);
    if (room) {
        Repository.deleteRoomByUserId(id);
    }

    // 이미 채팅방이 있다면 매칭하기
    roomList.forEach(room => {
        if (!room.member2) {
            room.member2 = id;
            isMatched = true;
            console.log(`Room [ ${room.id} ] 에서 ${id}와 ${room.member1}가 매칭되었습니다.`);
            io.emit('matched', {
                member1: id,
                member2: room.member1
            });
        }
    });

    // 없으면 새 채팅방 만들기
    if (!isMatched) {
        Repository.insertRoom(id);
        console.log(`Room - 생성되었습니다`);
    }
    res.send('success');
});

app.delete('/match/:id', (req, res) => {
    const {id} = req.params;
    console.log(id);
});

// 세션이 만료된 유저 핸들링
setInterval(() => {
    const timeoutUser = Repository.findTimeoutUser()
    timeoutUser.forEach(user => {
        const room = Repository.getRoomById(user.id);
        if (room) {
            const {member1, member2} = room;
            io.emit("cancel", {
                member1,
                member2
            });
            Repository.deleteRoomByUserId(user.id);
        }
    });
}, 2000);

server.listen(app.get("port"), () => {
    console.log(`🏇${app.get("port")}에서 서버가 실행중입니다!🚴`);
});

