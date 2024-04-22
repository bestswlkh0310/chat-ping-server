import prisma from "../../../../prisma/context.js";
import {RoomState} from "@prisma/client";

class RoomRepository {
    findByUserId = async (userId) => {
        return prisma.user
            .findFirst({
                where: {
                    userId: Number(userId)
                },
            })
            .userRoom({
                where: {
                    userId: userId
                },
                select: {
                    room: true
                }
            });
    }

    findByStateWithoutUserId = async (state, userId) => {
        return prisma.room.findMany({
            where: {
                state: state,
                userRoom: {
                    some: {
                        NOT: [
                            {
                                userId: userId
                            }
                        ]
                    }
                }
            }
        });
    }

    insertRoom = async () => {
        return prisma.room.create({
            data: {}
        });
    }

    updateStateId = async (state, id) => {
        return prisma.room.update({
            where: {
                id: Number(id)
            },
            data: {
                state: state
            }
        });
    }
}

export default new RoomRepository();