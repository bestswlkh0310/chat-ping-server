import jwtUtil from "jsonwebtoken";
import ApiException from "../global/execption/api.exception.js";
import Config from "../domain/config/config.js";

export const JwtToken = {
    ACCESS_TOKEN: 'ACCESS_TOKEN',
    REFRESH_TOKEN: 'REFRESH_TOKEN',
}

export const getTokenExpiredAt = (type) => {
    switch (type) {
        case JwtToken.ACCESS_TOKEN:
            return '14d'
        case JwtToken.REFRESH_TOKEN:
            return '2h'
    }
}

export const generateToken = (payload, type) => {
    return jwtUtil.sign(
        payload,
        Config.jwtSecret,
        {
            algorithm: 'HS256',
            expiresIn: getTokenExpiredAt(type),
        }
    );
}

export const decodePayload = (token) => {
    if (!token) {
        throw new ApiException('TokenMissingException', 403);
    }
    return jwtUtil.decode(token, Config.jwtSecret, (err) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                throw new ApiException('TokenExpiredException', 401);
            }
            throw new ApiException('TokenVerificationException', 403);
        }
    });
};

const getTokenFromHeader = (header) => {
    const authorization = header.authorization;
    if (!authorization) return "";
    return authorization.split(' ')[1];
}

const getPayloadFromHeader = (header) => {
    const token = getTokenFromHeader(header);
    return decodePayload(token);
}