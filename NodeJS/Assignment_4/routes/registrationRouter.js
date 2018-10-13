const express = require("express")
const router = express.Router()
const path = require("path")
const hasher = require('bcryptjs')

function hashPassword(password) {
    const salt = hasher.genSaltSync(10)
    return {hashedPassword: hasher.hashSync(password, salt), salt: salt}
}

router.get("/register", (req, res, next) => {
    res.send({message: "Register User Page"})
})

router.post("/register", (req, res, next) => {

    const RegistrationCredentials = require(path.join(__dirname, '..', 'models', 'registrationCredentials.js'))

    const email = req.body.email
    const username = req.body.username
    const password = req.body.password
    const passwordConf = req.body.passwordConf

    if (!email || !username || !password || !passwordConf) {
        console.error(`No required field. Email: ${email}, username: ${username}, password: ${password}, passwordConf: ${passwordConf}`)
        res.statusCode = 400
        res.send({message: "Required field missing."})
        return
    }

    const registrationCredentials = new RegistrationCredentials(email, username, password, passwordConf)

    if (!registrationCredentials.doPasswordsMatch()) {
        console.error(`Passwords not matching. Pass: ${password}, passConf: ${passwordConf}`)
        res.statusCode = 400
        res.send({message: "Passwords do not match."})
        return
    }

    const UserSchema = require(path.join(__dirname, '..', 'models', 'user.js'))
    const PasswordEncryption = require(path.join(__dirname, '..', 'models', 'passwordEncryption.js'))
    
    const hashResult = hashPassword(registrationCredentials.password)

    const newUser = new UserSchema({email: registrationCredentials.email, username: registrationCredentials.username, password: hashResult.hashedPassword})

    newUser.save((error, saveResult) => {
        if (error) {
            console.error(error)
            res.statusCode = 500
            res.send({message: "Error while registering user."})
            return
        }
        const newUserID = saveResult._id
        const TokenVerifier = require(path.join(__dirname, '..', 'auth', 'verifyToken.js'))
        const token = TokenVerifier.generateToken(newUserID)

        const passwordEncryption = new PasswordEncryption({email: newUser.email, salt: hashResult.salt})

        passwordEncryption.save((error, saveResult) => {
            res.statusCode = 200
            res.send({message: "User has been successfully registered", auth: true, token: token})
        })
    })
});

module.exports = router