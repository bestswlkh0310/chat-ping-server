import prisma from "../../../../prisma/context.js";
import {RoomState} from "@prisma/client";

class UserRoomRepository {
    insertUserRoom = async (user, room) => {
        return prisma.userRoom.create({
            data: {
                roomId: room.id,
                userId: user.id
            }
        });
    };

    findByUserStateIsFinished = async (user) => {
        return prisma.userRoom.findMany({
            where: {
                user,
                room: {
                    NOT: {
                        state: RoomState.FINISHED
                    }
                }
            },
            include: {
                room: true
            }
        });
    };

    /**
     * 같은 Room에 속해 있는 UserRoom을 조회합니다.
     */
    findBySelf = async (userRoom) => {
        return prisma.userRoom.findMany({
            where: {
                roomId: userRoom.room.id
            },
            include: {
                user: true
            }
        });
    }

    findByUserStateIsMatched = async (user) => {
        return prisma.userRoom.findMany({
            where: {
                user: user,
                room: {
                    state: RoomState.MATCHED
                }
            },
            include: {
                room: true
            }
        });
    };

    findByUser = async (user) => {
        return prisma.userRoom.findMany({
            where: {
                user: user
            },
            include: {
                room: true
            }
        });
    };
}

export default new UserRoomRepository();