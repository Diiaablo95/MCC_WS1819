const express = require("express")
const router = express.Router()

router.get("/logout", (req, res, next) => {
    console.log(req.session)

    delete req.session.jwtToken
    
    res.redirect(req.protocol + "://" + req.get("Host") + "/login")
})

module.exports = router