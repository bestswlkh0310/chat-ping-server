import {OAuth2Client} from "google-auth-library";
import Config from "../domain/config/config.js";
import ApiException from "../global/execption/api.exception.js";

export const verifyIdToken = async (idToken) => {
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
    return verifiedToken;
}