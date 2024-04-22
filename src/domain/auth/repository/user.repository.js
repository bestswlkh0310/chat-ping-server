import prisma from "../../../../prisma/context.js";
import {filters} from "pug";

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
        const user = await prisma.user.findMany({
            where: {
                email: email
            },
            include: {
                userRoom: {
                    include: {
                        room: true,
                        user: true
                    }
                }
            }
        });
        if (user.length > 0) {
            return user[0];
        }
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