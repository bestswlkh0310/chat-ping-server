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
}

export default new UserRepository();