import prisma from "../../../../prisma/context.js";

class AuthRepository {
    register = (email) => {
        prisma.user.create({
            data: {
                email
            }
        })
    }


}

export default new AuthRepository();