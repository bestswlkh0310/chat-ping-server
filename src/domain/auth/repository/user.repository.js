import prisma from "../../../../prisma/context.js";

class UserRepository {
    register = async (email) => {
        return prisma.user.create({
            data: {
                email: email,
            }
        });
    }

    findById = async (id) => {
        const user = await prisma.user.findMany({
            where: {
                id
            }
        });
        if (user.length > 0) {
            return user[0];
        }
    }

    findByEmail = async (email) => {
        return prisma.user.findFirst({
            where: {
                email: email
            }
        });
    }

    existByEmail = async (email) => {
        const user = await prisma.user.findMany({
            where: {
                email: email
            }
        });
        if (user.length > 0) {
            return user[0];
        }
    }

    updateSocketIdByEmail = async (email, socketId) => {
        return prisma.user.updateMany({
            where: {
                email: email
            },
            data: {
                socketId: socketId
            }
        });
    }
}

export default new UserRepository();