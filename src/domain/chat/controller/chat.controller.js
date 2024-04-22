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
        user.userRoom.forEach(userRoom => {
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
            const room = await RoomRepository.updateStateId(RoomState.MATCHED, matchedRoom.id);
            await UserRoomRepository.insertUserRoom(user.id, matchedRoom.id);
            room.userRoom.forEach((userRoom) => {
                const socketId = userRoom.user.socketId;
                console.log('sended- ',socketId);
                SocketClient.io.to(socketId).emit('flow');
            });
            return res.send({message: '매칭됐어요!'});
        } else {
            const room = await RoomRepository.insertRoom();
            await UserRoomRepository.insertUserRoom(user.id, room.id);
            console.log(`Room - 매칭할 채팅방이 없어 새 채팅방이 생성되었습니다`);
            return res.status(400).send({message: '매칭할 채팅방이 없어 새 채팅방이 생성되었습니다'});
        }
    };

    finishChat = async (req, res) => {
        const accessToken = getTokenByReq(req);
        const {email} = decodePayload(accessToken);
        const user = await UserRepository.findByEmail(email);
        if (!user) {
            throw new ApiException('유저를 찾을 수 없습니다', 404);
        }
        for (const userRoom of user.userRoom) {
            if (userRoom.room.state !== RoomState.FINISHED) {
                await RoomRepository.updateStateId(RoomState.FINISHED, userRoom.room.id);
                const userRooms = await UserRoomRepository.findByRoomId(userRoom.room.id);
                userRooms.forEach((userRoom) => {
                    SocketClient.io.to(userRoom.user.socketId).emit('flow');
                });
            }
        }
        res.send({message: 'finish'});
    };

    sendMessage = async (req, res) => {
        const {message} = req.body;
        const accessToken = getTokenByReq(req);
        const {email} = decodePayload(accessToken);
        const user = await UserRepository.findByEmail(email);
        for (const userRoom of user.userRoom) {
            const room = userRoom.room;
            const state = room.state;
            if (state === RoomState.MATCHED) {
                await ChatRepository.insert(message, user.id, room.id);
                const chatList = await ChatRepository.findByRoomId(room.id);
                const userRoom = await UserRoomRepository.findByRoomId(room.id);
                userRoom.forEach(userRoom => {
                    SocketClient.io.to(userRoom.user.socketId).emit('message', chatList);
                });
            }
        }
        res.send({message: '채팅 전송 성공'});
    };

    getChatList = async (req, res) => {
        const accessToken = getTokenByReq(req);
        const {email} = decodePayload(accessToken);
        const user = await UserRepository.findByEmail(email);
        for (const userRoom of user.userRoom) {
            const room = userRoom.room;
            const state = room.state;
            if (state === RoomState.MATCHED) {
                const chatList = await ChatRepository.findByRoomId(room.id);
                return res.send(chatList);
            }
        }
    };
}

export default new ChatController();