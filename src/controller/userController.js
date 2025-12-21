const UserModel = require('../models/userModel')
const TokenModel = require('../models/tokenModel')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const emailSender = require('../utils/emailSender')
const saltRounds = 10

const jwt = require('jsonwebtoken')

// register
exports.register = async (req, res) => {
    // destructuring to get values for email, username, password
    const { username, email, password } = req.body

    // check if username is available or not
    let userToRegister = await UserModel.findOne({ username })
    if (userToRegister) {
        return res.status(400).json({ error: "Username not available" })
    }

    // check if email is already registered or not
    userToRegister = await UserModel.findOne({ email })
    if (userToRegister) {
        return res.status(400).json({ error: "Email already registered" })
    }

    // encrypt password - (bcrypt)
    // const hashedPassword = crypto.createHmac('sha256','key').update(password).digest('hex')
    const salt = await bcrypt.genSalt(saltRounds)
    const hashedPassword = await bcrypt.hash(password, salt)

    // save user
    userToRegister = await UserModel.create({
        username,
        email,
        password: hashedPassword
    })
    if (!userToRegister) {
        return res.status(400).json({ error: "Failed to register. Try again later" })
    }

    // generate verification token/link
    let tokenToSend = await TokenModel.create({
        user: userToRegister._id,
        token: crypto.randomBytes(24).toString('hex')
    })
    if (!tokenToSend) {
        return res.status(400).json({ error: "Something went wrong" })
    }

    // send verification link in email - (nodemailer)
    const URL = `http://localhost:5000/api/user/verify/${tokenToSend.token}`

    emailSender({
        from: `noreply@something.com`,
        to: email,
        subject: `Email verification`,
        text: `Copy paste ${URL} in browser to verify your account.`,
        html: `<a href='${URL}'><button>VERIFY NOW</button></a>`
    })

    res.send({ userToRegister, success: true, message: "User registered successfully" })

}

// email verification
exports.verifyEmail = async (req, res) => {
    // check if token is valid or not
    let tokenToVerify = await TokenModel.findOne({ token: req.params.token })
    if (!tokenToVerify) {
        return res.status(400).json({ error: "Invalid token or token may have expired" })
    }

    // find user
    let userToVerify = await UserModel.findById(tokenToVerify.user)
    if (!userToVerify) {
        return res.status(400).json({ error: "User not found" })
    }

    // check if user is already verified
    if (userToVerify.isVerified) {
        return res.status(400).json({ error: "User already verified" })
    }

    // verify user
    userToVerify.isVerified = true
    userToVerify = await userToVerify.save()

    if (!userToVerify) {
        return res.status(400).json({ error: "Failed to verify. Try again later." })
    }

    // send message to user
    res.send({ message: "User verified successfully", success: true })
}

// resend verification link
exports.resendVerification = async (req, res) => {
    // check if email is registered or not
    let userToVerify = await UserModel.findOne({ email: req.body.email })
    if (!userToVerify) {
        return res.status(400).json({ error: "Email not registered" })
    }

    // check if email is already verified
    if (userToVerify.isVerified) {
        return res.status(400).json({ error: " User already verified" })
    }

    // generate verification token
    let tokenToSend = await TokenModel.create({
        user: userToVerify._id,
        token: crypto.randomBytes(24).toString('hex')
    })
    if (!tokenToSend) {
        return res.status(400).json({ error: "Something went wrong" })
    }

    // send token in email
    const URL = `http://localhost:5000/api/user/verify/${tokenToSend.token}`

    emailSender({
        from: `noreply@something.com`,
        to: userToVerify.email,
        subject: `Email verification`,
        text: `Copy paste ${URL} in browser to verify your account.`,
        html: `<a href='${URL}'><button>VERIFY NOW</button></a>`
    })

    // send message to user
    res.send({ message: "Verification link has been sent to your email." })
}

// forget password
exports.forgetPassword = async (req, res) => {
    // check if email is registered or not
    let user = await UserModel.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).json({ error: "Email not registered." })
    }
    // generate password reset token/link
    let tokenToSend = await TokenModel.create({
        user: user._id,
        token: crypto.randomBytes(24).toString('hex')
    })
    if (!tokenToSend) {
        return res.status(400).json({ error: "Something went wrong. Try again Later" })
    }
    // send password reset link in email
    let URL = `http://localhost:5000/api/user/resetpassword/${tokenToSend.token}`
    emailSender({
        from: `noreply@something.com`,
        to: req.body.email,
        subject: "RESET PASSWORD LINK",
        text: "Copy Paste the following link in browser. " + URL,
        html: `<a href='${URL}'><button>RESET PASSWORD</button></a>`
    })

    // send message to user
    res.send({ message: "Password reset link has been sent to your email." })
}

// reset password
exports.resetPassword = async (req, res) => {
    // check if token is valid or not
    let token = await TokenModel.findOne({token: req.params.token})
    if(!token){
        return res.status(400).json({error:"Invalid token or token may have expired"})
    }
    // find user
    let user = await UserModel.findById(token.user)
    if(!user){
        return res.status(400).json({error:"User not found"})
    }
    // encrypt password
    let salt = await bcrypt.genSalt(saltRounds)
    let hashedPassword = await bcrypt.hash(req.body.password, salt)
    // save user
    user.password = hashedPassword
    user = await user.save()
    if(!user){
        return res.status(400).json({error:"Something went wrong. Try again later"})
    }
    // send message to user
    res.send({success: true, message: "Password changed successfully."})
}

// login
exports.login = async (req, res) => {
    // destructure data to get email and password
    let {email, password} = req.body

    // check if email is registered or not
    let userToLogin = await UserModel.findOne({email})
    if(!userToLogin){
        return res.status(400).json({error:"Email not registered"})
    }
    // check if password is correct or not
    let passwordMatch = await bcrypt.compare(password, userToLogin.password) 
    if(!passwordMatch){
        return res.status(400).json({error:"Email and Password do not match."})
    }
    // check if user is verified or not
    if(!userToLogin.isVerified){
        return res.status(400).json({error:"User not verified"})
    }
    // generate login token using jwt
    let token = jwt.sign({
        _id: userToLogin._id},
        process.env.JWT_SECRET,
        {
            expiresIn: '24h'
        }
    )

    // send message, login token to user
    res.send({success: true, message: "Login successful", token})
}

// get users list

// get user details

// update user

// delete user

// authentication, authorization