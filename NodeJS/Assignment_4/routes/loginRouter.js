const express = require("express")
const router = express.Router()
const hasher = require('bcryptjs')
const path = require("path")

function hashPassword(password, salt) {
    return hasher.hashSync(password, salt).trim()
}

router.get("/login", (req, res, next) => {
    res.send({message: "Login Page"})
})

router.post("/login", (req, res, next) => {

    console.log(req.session)

    const email = req.body.logemail
    const password = req.body.logpassword

    if (!email || !password) {
        console.error(`No required field. Password: ${password}, email: ${email}`)
        res.statusCode = 400
        res.send({message: "All fields required."})
        return
    }

    const mongoose = require('mongoose')

    mongoose.connection.db.collection("passwordencryptions").findOne({email: email}).then(credentials => {

        if (!credentials) {
            res.statusCode = 401
            res.send({message: "Wrong email or password."})
            return
        }

        const hashedPassword = hashPassword(password, credentials.salt)

        mongoose.connection.db.collection("userschemas").findOne({email: email, password: hashedPassword}).then(user => {
            
            if(!user) {
                res.statusCode = 401
                res.send({message: "Wrong email or password."})
                return
            }

            const TokenVerifier = require(path.join(__dirname, '..', 'auth', 'verifyToken.js'))
    
            const userID = user._id
            const token = TokenVerifier.generateToken(userID)

            req.session.jwtToken = token

            res.redirect(req.protocol + "://" + req.get("Host") + "/profile")
        })
    })
})

module.exports = router