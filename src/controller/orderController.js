const Order = require('../models/OrderModel')
const OrderItems = require('../models/OrderItemsModel')

// place order
exports.placeOrder = async (req, res) => {
    // save individual orderitems - orderitems ids
    let orderItemsIds = await Promise.all(
        req.body.orderItems.map(async orderitem => {
            let orderItemToPlace = await OrderItems.create({
                product: orderitem.product,
                quantity: orderitem.quantity
            })
            if (!orderItemToPlace) {
                return res.status(400).json({ error: "Something went wrong. Failed to place order" })
            }
            return orderItemToPlace._id
        })
    )
    // calculate total
    let individual_totals = await Promise.all(
        orderItemsIds.map(async orderItemId => {
            let orderItem = await OrderItems.findById(orderItemId).populate('product', 'product_price')
            return orderItem.product.product_price * orderItem.quantity
        })
    )
    let total = individual_totals.reduce((acc, cur) => acc + cur)
    // save order
    let orderToPlace = await Order.create({
        orderItems: orderItemsIds,
        user: req.body.user,
        total,
        street: req.body.street,
        alternate_street: req.body.alternate_street,
        city: req.body.city,
        postal_code: req.body.postal_code,
        state: req.body.state,
        country: req.body.country,
        phone: req.body.phone
    })
    if (!orderToPlace) {
        return res.status(400).json({ error: "Something went wrong." })
    }
    res.send({ success: true, message: "Order placed successfully", orderToPlace })
}

// get all orders
exports.getAllOrders = async (req, res) => {
    let orders = await Order.find().populate('user')
        .populate({ path: 'orderItems', populate: { path: 'product', populate: 'category' } })
    if (!orders) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(orders)
}

// get order details
exports.getOrderDetails = async (req, res) => {
    let order = await Order.findById(req.params.id).populate('user')
        .populate({ path: 'orderItems', populate: { path: 'product', populate: 'category' } })
    if (!order) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(order)
}

// get orders by user
exports.getAllOrdersByUser = async (req, res) => {
    let orders = await Order.find({ user: req.params.userId }).populate('user')
        .populate({ path: 'orderItems', populate: { path: 'product', populate: 'category' } })
    if (!orders) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(orders)
}

// get orders by status
exports.getAllOrdersByStatus = async (req, res) => {
    let orders = await Order.find({ order_status: req.params.status }).populate('user')
        .populate({ path: 'orderItems', populate: { path: 'product', populate: 'category' } })
    if (!orders) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(orders)
}

// update order
exports.updateOrder = async (req, res) => {
    let orderToUpdate = await Order.findByIdAndUpdate(req.params.id, {
        order_status: req.body.status
    }, { new: true })
    if (!orderToUpdate) {
        return res.status(400).json({ error: "Something went wrong." })
    }
    res.send(orderToUpdate)
}

// delete order
exports.deleteOrder = async (req, res) => {
    Order.findByIdAndDelete(req.params.id)
        .then(deletedOrder => {
            if (!deletedOrder) {
                return res.status(400).json({ error: "Order not found" })
            }
            deletedOrder.orderItems.map(orderItem => {
                OrderItems.findByIdAndDelete(orderItem)
                    .then(deletedItem => {
                        if (!deletedItem) {
                            return res.status(400).json({ error: "Something went wrong" })
                        }
                    })
            })
            res.send({ message: "Order deleted successfully" })
        })
        .catch(error => {
            return res.status(400).json({ error: error.message })
        })
}


/*
req.body-{
    orderItems - [{product, quantity}, {}]
    user -
    street -
    alt_street -
}
*/