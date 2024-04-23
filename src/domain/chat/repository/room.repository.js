import prisma from "../../../../prisma/context.js";

class RoomRepository {

    findByStateWithoutUser = async (state, user) => {
        return prisma.room.findMany({
            where: {
                state: state,
                userRoom: {
                    some: {
                        NOT: [
                            {
                                user: user
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

    updateState = async (state, room) => {
        return prisma.room.update({
            where: {
                id: room.id
            },
            data: {
                state: state
            },
            include: {
                userRoom: {
                    include: {
                        user: true
                    }
                }
            }
        });
    }
}

export default new RoomRepository();