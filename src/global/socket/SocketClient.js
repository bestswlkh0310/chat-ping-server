import {Server} from "socket.io";
import {decodePayload} from "../../common/jwt.js";
import UserRepository from "../../domain/auth/repository/user.repository.js";

class SocketClient {

    static io

    static init(server) {
        this.io = new Server(server, {
            cors: {
                origin: "http://localhost:3000",
                credentials: true
            }
        });
        this.io.on('connection', (socket) => {
            socket.on('login', async (data) => {
                const {accessToken} = data;
                const {email} = decodePayload(accessToken);
                await UserRepository.updateSocketIdByEmail(email, socket.id);
            });
        });

        // this.io.on("connection", (socket) => {
        //
        //     socket.on('cancel', (id) => {
        //         const room = Repository.getRoomById(id);
        //         if (room) {
        //             const {member1, member2} = room;
        //             Socket.io.emit("cancel", {
        //                 member1,
        //                 member2
        //             });
        //         }
        //         Repository.deleteRoomByUserId(id);
        //     });
        //
        //     socket.on('message', (data) => {
        //         const {message, id} = data;
        //         const room = Repository.getRoomById(id);
        //         if (room) {
        //             const {member1, member2} = room;
        //             Repository.insertChat(room.id, id, message);
        //             const chatList = Repository.getChatListByRoomId(room.id)
        //             Socket.io.emit("message", {
        //                 member1,
        //                 member2,
        //                 chatList
        //             });
        //         }
        //     });
        // });

    }
}

export default SocketClient;
