import prisma from "../../../../prisma/context.js";

class ChatRepository {
    findByRoomId = async (roomId) => {
        return prisma.chat.findMany({
            where: {
                roomId: roomId
            },
            include: {
                sender: true
            }
        });
    }

    insert = async (message, senderId, roomId) => {
        return prisma.chat.create({
            data: {
                message,
                senderId,
                roomId
            }
        });
    }
}

export default new ChatRepository();