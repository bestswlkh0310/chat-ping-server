import {generateToken, JwtToken} from "../../../common/jwt.js";

class TestController {
    testToken = async (req, res) => {
        const {email} = req.body;
        if (!email) {
            return res.status(400).send({message: 'invalid email'});
        }
        const accessToken = generateToken({
            email
        }, JwtToken.ACCESS_TOKEN);
        const refreshToken = generateToken({
            email
        }, JwtToken.REFRESH_TOKEN);
        res.send({
            accessToken,
            refreshToken
        });
    }
}

export default new TestController();