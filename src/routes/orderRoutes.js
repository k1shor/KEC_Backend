const router = require('express').Router()
const { placeOrder, getAllOrders, getOrderDetails, getAllOrdersByUser, getAllOrdersByStatus, updateOrder, deleteOrder } = require('../controller/orderController')

router.post('/placeorder', placeOrder)
router.get('/getallorders', getAllOrders)
router.get('/getorderdetails/:id', getOrderDetails)
router.get("/getordersbyuser/:userId", getAllOrdersByUser)
router.get('/getordersbystatus/:status', getAllOrdersByStatus)
router.put('/updateorder/:id', updateOrder)
router.delete('/deleteorder/:id', deleteOrder)

module.exports = router