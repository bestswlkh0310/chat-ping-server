import prisma from "../../../../prisma/context.js";

class ChatRepository {
    findByRoomId = async (roomId) => {
        return prisma.chat.findMany({
            where: {
                roomId: roomId
            }
        });
    }
}

export default new ChatRepository();