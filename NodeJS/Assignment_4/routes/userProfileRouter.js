const express = require("express")
const router = express.Router()
const path = require("path")

router.get("/profile", (req, res, next) => {

    const session = req.session

    console.log(req.session)

    if(!session || !session.jwtToken) {
        res.sendStatus(403)
        return
    }

    const TokenVerifier = require(path.join(__dirname, '..', 'auth', 'verifyToken.js'))
    const token = session.jwtToken

    if (!token) {
        res.sendStatus(403)
        return
    }

    const userID = TokenVerifier.getUserID(token)

    if (!userID) {
        res.sendStatus(403)
        return
    }

    const mongoose = require('mongoose');
    mongoose.connection.db.collection("userschemas").findOne({_id: new mongoose.Types.ObjectId(userID)}).then(user => {
        res.send({message: "User logged in!", username: user.username, email: user.email, auth: true, token: token, userId: user._id})
    })
})

module.exports = router