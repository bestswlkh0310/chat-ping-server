import prisma from "../../../../prisma/context.js";

class ChatRepository {
    findByRoom = async (room) => {
        return prisma.chat.findMany({
            where: {
                room: room
            },
            include: {
                sender: true
            }
        });
    }

    insert = async (message, sender, room) => {
        return prisma.chat.create({
            data: {
                message: message,
                senderId: sender.id,
                roomId: room.id
            }
        });
    }
}

export default new ChatRepository();