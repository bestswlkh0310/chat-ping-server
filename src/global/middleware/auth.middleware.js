import ApiException from "../execption/api.exception.js";
import Config from "../../domain/config/config.js";
import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        throw new ApiException('유효하지 않은 토큰', 401);
    }
    if (!authorization.startsWith('Bearer ')) {
        throw new ApiException('유효하지 않은 토큰', 401);
    }
    const accessToken = authorization.split(' ')[1];

    let isNotNext = true;

    jwt.verify(accessToken, Config.jwtSecret, (err) => {
        if (err) {
            throw new ApiException('유효하지 않은 토큰', 401);
        } else {
            isNotNext = false;
            return next();
        }
    });
    if (isNotNext) {
        return next();
    }
};

export default auth;