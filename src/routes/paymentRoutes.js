const { processPayment, sendStripeKey } = require('../controller/paymentController')

const router = require('express').Router()

router.post('/processpayment', processPayment)
router.get('/getstripekey', sendStripeKey)

module.exports = router