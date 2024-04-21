import {OAuth2Client} from "google-auth-library";
import Config from "../../config/config.js";
import ApiException from "../../../global/execption/api.exception.js";
import {generateToken, JwtToken, verifyIdToken} from "../../../common/jwt.js";
import AuthRepository from "../repository/user.repository.js";

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
            accessToken, refreshToken
        });
    };
}

export default new AuthController();