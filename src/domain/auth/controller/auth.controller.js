import {OAuth2Client} from "google-auth-library";
import Config from "../../config/config.js";
import ApiException from "../../../global/execption/api.exception.js";
import {generateToken, JwtToken} from "../../../common/jwt.js";

class AuthController {
    login = async (req, res) => {
        const {idToken} = req.body;

        // valid id-token
        const client = new OAuth2Client();
        let verifiedToken
        try {
            verifiedToken = await client.verifyIdToken({
                idToken: idToken,
                audience: Config.googleClientId
            });
        } catch (e) {
            throw new ApiException(`Invalid IdToken ${e.message}`, 400);
        }
        const payload = verifiedToken.getPayload();

        // login
        const {email} = payload;
        // const isExistUser = UserModel.existByEmailAndPlatformType(email, platform_type);
        //
        // if (!isExistUser) {
        //     throw new AuthException('Not Register User', 401);
        // }

        // make tokens
        const refreshToken = generateToken({
            email: email,
        }, JwtToken.REFRESH_TOKEN);

        const accessToken = generateToken({
            email: email,
        }, JwtToken.ACCESS_TOKEN);
        return {
            refresh_token: refreshToken,
            access_token: accessToken
        };
    };
}

export default new AuthController();