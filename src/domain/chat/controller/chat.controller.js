import Repository from "../../repository/Repository.js";
import {roomList} from "../../repository/Store.js";
import Socket from "../../../global/socket/socket.js";

class ChatController {
    match = (req, res) => {
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
                Socket.io.emit('matched', {
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
    }
}

export default new ChatController();