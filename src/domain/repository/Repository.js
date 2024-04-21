import {chatList, onlineUser, roomList, setChatList, setOnlineUser, setRoomList} from "./Store.js";
import {v4} from "uuid";

class Repository {

    deleteRoomByUserId = (id) => {
        setRoomList(roomList.filter(room => {
            setChatList(chatList.filter(chat => chat.roomId !== room.roomId))
            return room.member1 !== id && room.member2 !== id;
        }));
    };

    getChatListByRoomId = (id) => {
        return chatList.filter(chat => {
            return chat.roomId === id
        });
    }

    getRoomById = (id) => {
        const rooms = roomList.filter(room => {
            return room.member1 === id || room.member2 === id;
        });
        if (rooms.length) {
            return rooms[0]
        } else {
            return null;
        }
    };

    findByUserId = (id) => {
        const users = onlineUser.filter(user => user.id === id);
        if (users.length) {
            return users[0];
        } else {
            return null;
        }
    }

    insertUser = (id) => {
        const user = this.findByUserId(id);
        if (user) {
            user.lastActive = Date.now();
        } else {
            const newUser = {
                id,
                lastActive: Date.now(),
                isChatting: false
            }
            onlineUser.push(newUser);
            console.log(`User [ ${id} ] 가 온라인입니다.`);
        }
    }

    insertChat = (roomId, id, message) => {
        const newChat = {
            roomId,
            senderId: id,
            message
        }
        chatList.push(newChat);
    }

    insertRoom = (member1) => {
        roomList.push({
            id: v4(),
            member1
        });
    }

    findTimeoutUser = () => {
        const currentTime = Date.now();
        return onlineUser.filter(user => currentTime - user.lastActive > 6_000);
    }

    deleteTimeOutUser = () => {
        const currentTime = Date.now();
        setOnlineUser(onlineUser.filter(user => currentTime - user.lastActive <= 6_000));
    }
}

export default new Repository();