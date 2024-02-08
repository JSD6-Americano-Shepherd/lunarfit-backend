import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const SecretKey = process.env.JWT_SECRET_KEY

const authenticateToken = (req, res, next) => {
    // const authHeader = req.headers['authorization']
    // const token = authHeader && authHeader.split(' ')[1]
    const token = req.cookies.token

    if (token == null) return res.sendStatus(401) // if there isn't any token

    try {
        const data = jwt.verify(token, SecretKey)
        req.data = data
        //console.log('user', user)
        next()
    } catch (error) {
        return res.sendStatus(403)
    }
}
export default authenticateToken;