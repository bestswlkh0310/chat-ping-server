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
};

export const generateToken = (payload, type) => {
    return jwtUtil.sign(
        payload,
        Config.jwtSecret,
        {
            algorithm: 'HS256',
            expiresIn: getTokenExpiredAt(type),
        }
    );
};

export const decodePayload = (token) => {
    if (!token) {
        throw new ApiException('유효하지 않은 토큰', 401);
    }
    return jwtUtil.decode(token, Config.jwtSecret, (err) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                throw new ApiException('유효하지 않은 토큰', 401);
            }
            throw new ApiException('유효하지 않은 토큰', 401);
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

export const getTokenByReq = (req) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        throw new ApiException('유효하지 않은 토큰', 401);
    }
    if (!authorization.startsWith('Bearer ')) {
        throw new ApiException('유효하지 않은 토큰', 401);
    }
    return authorization.split(' ')[1];
}