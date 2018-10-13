const jwt = require('jsonwebtoken')
const path = require("path");
const secretConfig = require(path.join(__dirname, '..', 'config.js'))

class TokenVerifier {

    static generateToken(userID) {
        return jwt.sign({id: userID}, secretConfig.secret, {expiresIn: "24h"})
    }

    static getUserID(token) {
        try {
            const decodedToken = jwt.verify(token, secretConfig.secret)
            return decodedToken.id
        } catch {
            console.error(error)
            return false
        }
    }
}

module.exports = TokenVerifier