const UserModel = require('../models/userModel')
const jwt = require('jsonwebtoken')

// require login
exports.isLoggedIn = async (req, res, next) => {
    try {
        let token = req.headers['authorization']
        if (!token) {
            return res.status(401).json({ error: "Login token not found" })
        }

        let decoded = jwt.verify(token.toString().split(" ")[1], process.env.JWT_SECRET)

        let user = await UserModel.findById(decoded._id)
        if (!user) {
            return res.status(401).json({ error: "invalid login token" })
        }
        next()

    }
    catch (error) {
        return res.status(401).json({ error: "invalid login token" })
    }

}


// require admin
exports.isAdmin = async (req, res, next) => {
     try {
        let token = req.headers['authorization']
        if (!token) {
            return res.status(401).json({ error: "Login token not found" })
        }

        let decoded = jwt.verify(token.toString().split(" ")[1], process.env.JWT_SECRET)

        let user = await UserModel.findById(decoded._id)
        console.log(user)
        if (!user) {
            return res.status(401).json({ error: "Invalid user" })
        }
        if(user.role !== 1){
            return res.status(403).json({error:"User not authorized."})
        }
        next()
    }
    catch (error) {
        return res.status(401).json({ error: "invalid login token" })
    }
}