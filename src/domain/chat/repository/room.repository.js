import prisma from "../../../../prisma/context.js";

class RoomRepository {
    findRoomByUserId = async (userId) => {
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
}

export default new RoomRepository();