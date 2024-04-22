import {decodePayload, generateToken, getTokenByReq, JwtToken} from "../../../common/jwt.js";
import AuthRepository from "../repository/user.repository.js";
import ApiException from "../../../global/execption/api.exception.js";
import {verifyIdToken} from "../../../common/oauth.js";

class AuthController {
    login = async (req, res) => {
        const {idToken} = req.body;

        const verifiedToken = await verifyIdToken(idToken);
        const payload = verifiedToken.getPayload();
        const {email} = payload;
        const existUser = await AuthRepository.existByEmail(email);
        if (!existUser) {
            await AuthRepository.register(email);
        }

        const refreshToken = generateToken({
            email: email,
        }, JwtToken.REFRESH_TOKEN);

        const accessToken = generateToken({
            email: email,
        }, JwtToken.ACCESS_TOKEN);

        res.send({
            accessToken,
            refreshToken,
            email
        });
    };

    refresh = async (req, res) => {
        const refreshToken = getTokenByReq(req);
        const payload = await decodePayload(refreshToken);
        const {email} = payload;

        if (!email) {
            throw new ApiException('유효하지 않은 토큰', 401);
        }

        const accessToken = generateToken({
            email: email,
        }, JwtToken.ACCESS_TOKEN);

        res.send({
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
    };
}

export default new AuthController();