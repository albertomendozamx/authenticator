import jwt from "jsonwebtoken"

/**
 * Middleware to evaluate the JWT
 * 
 * @param {object} req - The Authorization header
 * @param {object} res - The response body
 * @param {function} next - The callback 
 * @returns An HTTP response with status code or the callback function
 */
export async function tokenVerify(req, res, next) {
    const token = req.headers.authorization || false
    if (!token) return res.status(401).send({ status: false, error: 'tokenExpected' })
    var decode
    try {
        decode = jwt.verify(token, process.env.JWT_SECRET)
        req.user = {
            uuid: decode.user
        }
        next()
    } catch (error) {
        return res.status(401).send({ status: false, error: error.message })
    }
}