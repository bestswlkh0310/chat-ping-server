import {decodePayload, getTokenByReq} from "../../../common/jwt.js";
import RoomRepository from "../repository/room.repository.js";
import UserRoomRepository from "../repository/user.room.repository.js";
import {RoomState} from "@prisma/client";
import UserRepository from "../../auth/repository/user.repository.js";
import {choiceArr} from "../../../common/random.js";
import ApiException from "../../../global/execption/api.exception.js";
import ChatRepository from "../repository/chat.repository.js";
import SocketClient from "../../../global/socket/SocketClient.js";

class ChatController {

    getFlow = async (req, res) => {
        const accessToken = await getTokenByReq(req);
        const {email} = decodePayload(accessToken);
        const user = await UserRepository.findByEmail(email);
        if (!user) {
            throw new ApiException('유저를 찾을 수 없습니다', 400);
        }
        let resultState = RoomState.IDLE
        const userRoom = await UserRoomRepository.findByUser(user);
        userRoom.forEach(userRoom => {
            const state = userRoom.room.state
            if (state === RoomState.MATCHED) {
                resultState = RoomState.MATCHED;
            } else if (state === RoomState.IDLE) {
                resultState = 'MATCHING';
            }
        });
        return res.send({
            flow: resultState
        });
    }

    match = async (req, res) => {
        const accessToken = getTokenByReq(req);
        const {email} = decodePayload(accessToken);
        const user = await UserRepository.findByEmail(email);
        if (!user) {
            console.log('not found user');
            throw new ApiException('유저를 찾을 수 없습니다', 404);
        }

        // 이미 채팅방이 있다면 매칭하기
        const availableRooms = await RoomRepository.findByStateWithoutUser(RoomState.IDLE, user);
        let invalidMatch = true;
        const userRoom = await UserRoomRepository.findByUser(user);
        userRoom.forEach(userRoom => {
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
            const room = await RoomRepository.updateState(RoomState.MATCHED, matchedRoom);
            await UserRoomRepository.insertUserRoom(user, matchedRoom);
            room.userRoom.forEach((userRoom) => {
                const socketId = userRoom.user.socketId;
                console.log('sended- ',socketId);
                SocketClient.io.to(socketId).emit('flow');
            });
            return res.send({message: '매칭됐어요!'});
        } else {
            const room = await RoomRepository.insertRoom();
            console.log('inserted -', room);
            await UserRoomRepository.insertUserRoom(user, room);
            console.log(`Room - 매칭할 채팅방이 없어 새 채팅방이 생성되었습니다`);
            return res.status(400).send({message: '매칭할 채팅방이 없어 새 채팅방이 생성되었습니다'});
        }
    };

    finishChat = async (req, res) => {
        const accessToken = getTokenByReq(req);
        const {email} = decodePayload(accessToken);
        const user = await UserRepository.findByEmail(email);
        const userRooms = await UserRoomRepository.findByUserStateIsFinished(user);
        for (const userRoom of userRooms) {
            await RoomRepository.updateState(RoomState.FINISHED, userRoom.room);
            const userRooms = await UserRoomRepository.findBySelf(userRoom);

            // '채팅 종료' 소켓 전송
            userRooms.forEach((userRoom) => {
                SocketClient.io.to(userRoom.user.socketId).emit('flow');
            });
        }
        res.send({message: 'finish'});
    };

    sendMessage = async (req, res) => {
        const {message} = req.body;
        const accessToken = getTokenByReq(req);
        const {email} = decodePayload(accessToken);
        const user = await UserRepository.findByEmail(email);
        const userRooms = await UserRoomRepository.findByUserStateIsMatched(user);
        for (const userRoom of userRooms) {
            await ChatRepository.insert(message, user, userRoom.room);
            const chatList = await ChatRepository.findByRoom(userRoom.room);
            const userRooms = await UserRoomRepository.findBySelf(userRoom);

            // '메세지 전송' 소켓 전송
            userRooms.forEach(userRoom => {
                console.log(userRoom.user.socketId)
                SocketClient.io.to(userRoom.user.socketId).emit('message', chatList);
            });
        }
        res.send({message: '채팅 전송 성공'});
    };

    getChatList = async (req, res) => {
        const accessToken = getTokenByReq(req);
        const {email} = decodePayload(accessToken);
        const user = await UserRepository.findByEmail(email);
        const userRooms = await UserRoomRepository.findByUserStateIsMatched(user);
        for (const userRoom of userRooms) {
            const chatList = await ChatRepository.findByRoom(userRoom.room);
            return res.send(chatList);
        }
    };
}

export default new ChatController();