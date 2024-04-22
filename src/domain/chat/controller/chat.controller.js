import {decodePayload, getTokenByReq} from "../../../common/jwt.js";
import RoomRepository from "../repository/room.repository.js";
import UserRoomRepository from "../repository/user.room.repository.js";
import {RoomState} from "@prisma/client";
import UserRepository from "../../auth/repository/user.repository.js";
import {choiceArr} from "../../../common/random.js";
import ApiException from "../../../global/execption/api.exception.js";

class ChatController {
    match = async (req, res) => {
        const accessToken = getTokenByReq(req);
        const {email} = decodePayload(accessToken);
        const user = await UserRepository.findByEmail(email);
        if (!user) {
            throw new ApiException('유저를 찾을 수 없습니다', 404);
        }

        // 이미 채팅방이 있다면 매칭하기
        const availableRooms = await RoomRepository.findByStateWithoutUserId(RoomState.IDLE, user.id);
        let invalidMatch = true;
        user.userRoom.forEach(userRoom => {
            if (!invalidMatch) {
                return;
            }
            const state = userRoom.room.state;
            if (state === RoomState.MATCHED || state === RoomState.IDLE) {
                invalidMatch = false;
                return res.status(400).send({message: '이미 매칭 중입니다'});
            }
        });
        if (!invalidMatch) {
            return;
        }

        if (availableRooms.length) {
            const matchedRoom = choiceArr(availableRooms);
            await RoomRepository.updateStateId(RoomState.MATCHED, matchedRoom.id);
            await UserRoomRepository.insertUserRoom(user.id, matchedRoom.id);
            return res.send({message: '매칭됐어요!'});
        } else {
            const room = await RoomRepository.insertRoom();
            await UserRoomRepository.insertUserRoom(user.id, room.id);
            console.log(`Room - 매칭할 채팅방이 없어 새 채팅방이 생성되었습니다`);
            return res.send({message: '매칭할 채팅방이 없어 새 채팅방이 생성되었습니다'});
        }
    }
}

export default new ChatController();