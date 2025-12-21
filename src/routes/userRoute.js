const { register, verifyEmail, resendVerification, forgetPassword, resetPassword, login } = require('../controller/userController')
const { userCheck, validationMethod } = require('../middleware/validationScript')

const router = require('express').Router()

router.post('/register', userCheck, validationMethod, register)
router.get('/verify/:token', verifyEmail)
router.post('/resendVerification', resendVerification)

router.post('/forgetpassword', forgetPassword)
router.post('/resetpassword/:token', resetPassword)
router.post('/login', login)

module.exports = router