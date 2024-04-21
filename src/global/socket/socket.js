import {Server} from "socket.io";
import Repository from "../../domain/repository/Repository.js";
import {onlineUser} from "../../domain/repository/Store.js";

class Socket {

    static io

    static init(server) {
        this.io = new Server(server, {
            cors: {
                origin: "http://localhost:3000",
                credentials: true
            }
        });

        this.io.on("connection", (socket) => {

            // 온라인 유저 받아오기
            socket.on('online', (id) => {
                Repository.insertUser(id);
                socket.emit('online', onlineUser.length);
            });

            socket.on('cancel', (id) => {
                const room = Repository.getRoomById(id);
                if (room) {
                    const {member1, member2} = room;
                    Socket.io.emit("cancel", {
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
                    Socket.io.emit("message", {
                        member1,
                        member2,
                        chatList
                    });
                }
            });
        });
    }
}

export default Socket;
