import prisma from "../../../../prisma/context.js";

class UserRoomRepository {
    insertUserRoom = async (userId, roomId) => {
        return prisma.userRoom.create({
            data: {
                roomId: roomId,
                userId: userId,
            }
        });
    }

    findByRoomId = async (roomId) => {
        return prisma.userRoom.findMany({
            where: {
                roomId: roomId
            },
            include: {
                user: true
            }
        });
    }
}

export default new UserRoomRepository();