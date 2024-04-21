import express from "express";
import {Server} from "socket.io";
import http from "http";
import {getRandomInt} from "./util.js";
import {onlineUser, chatList, roomList, setRoomList, setChatList} from "./db.js";
import {v4} from "uuid";
import cors from "cors";

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

const deleteRoomById = (id) => {
    Object.keys(roomList).forEach(roomId => {
        const room = roomList[roomId];
        if (room.member1 === id || room.member2 === id) {
            delete roomList[roomId];
            Object.keys(chatList).forEach(chatRoomId => {
                if (chatRoomId === roomId) {
                    delete chatList[chatRoomId];
                }
            });
        }
    });
};

const getRoomById = (id) => {
    return Object.keys(roomList).filter(roomId => {
        const room = roomList[roomId];
        return room.member1 === id || room.member2 === id;
    }).map(roomId => roomList[roomId]);
};

io.on("connection", (socket) => {

    // 온라인 유저 받아오기
    socket.on('online', (id) => {
        // 온라인 유저 저장
        if (!onlineUser[id]) {
            onlineUser[id] = {
                lastActive: Date.now(),
                isChatting: false
            };
            console.log(`User [ ${id} ] 가 온라인입니다.`);
        } else {
            onlineUser[id].lastActive = Date.now();
        }

        // 온라인 유저 개수 반환
        const count = Object.keys(onlineUser).length
        socket.emit('online', count);
    });

    socket.on('cancel', (id) => {
        const rooms = getRoomById(id);
        if (rooms.length) {
            const {member1, member2} = rooms[0];
            io.emit("cancel", `${member1} ${member2}`);
        }
        deleteRoomById(id);
    });
});

app.post("/match/:id", (req, res) => {
    const {id} = req.params;
    let isMatched = false;
    Object.keys(roomList).forEach(roomId => {
        const room = roomList[roomId];
        if (!room.member2) {
            room.member2 = id;
            isMatched = true;
            console.log(`Room [ ${roomId} ] 에서 ${id}와 ${room.member1}가 매칭되었습니다.`);
            io.emit('matched', `${id} ${room.member1}`);
        }
    });
    if (!isMatched) {
        const newRoomId = v4();
        roomList[newRoomId] = {
            member1: id
        };
        console.log(`Room [ ${newRoomId} ] 가 생성되었습니다`);
    }
    res.send('success');
});

app.delete('/match/:id', (req, res) => {
    const {id} = req.params;
    console.log(id);
});

// 세션이 만료된 유저 핸들링
setInterval(() => {
    const currentTime = Date.now();
    Object.keys(onlineUser).forEach(id => {
        if (currentTime - onlineUser[id].lastActive > 6_000) {
            // 유저 삭제
            delete onlineUser[id];
            console.log(`User [ ${id} ] 가 오프라인입니다.`);

            // 방 삭제
            const rooms = getRoomById(id);
            if (rooms.length) {
                const {member1, member2} = rooms[0];
                io.emit("cancel", `${member1} ${member2}`);
            }
            deleteRoomById(id);
        }
    });
}, 2000);

server.listen(app.get("port"), () => {
    console.log(`🏇${app.get("port")}에서 서버가 실행중입니다!🚴`);
});

