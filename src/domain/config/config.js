import dotenv from 'dotenv';
dotenv.config();

const Config = {
    port: process.env.PORT,
    jwtSecret: process.env.JWT_SECRET,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
}

export default Config;