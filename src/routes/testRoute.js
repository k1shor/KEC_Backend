const express = require('express')
const { testFunction, another } = require('../controller/testController')
const router = express.Router()

router.get('/hello', testFunction)
router.get('/', another)

module.exports = router