const ProductModel = require('../models/productModel')
const fs = require('fs')

// add new product
exports.addProduct = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "Product Image required" })
    }
    let productToAdd = await ProductModel.create({
        product_name: req.body.product_name,
        product_price: req.body.product_price,
        product_description: req.body.product_description,
        count_in_stock: req.body.count_in_stock,
        category: req.body.category,
        product_image: req.file?.path
    })
    if (!productToAdd) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send({ productToAdd, success: true, message: "Product Added successfully" })
}

// get all products
exports.getAllProducts = async (req, res) => {
    let products = await ProductModel.find().populate('category', 'category_name')
    // .select('-product_price')
    // .select('product_price').select('product_name')
    if (!products) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send({ products, success: true })
}

// get product details
exports.getProductDetails = async (req, res) => {
    let product = await ProductModel.findById(req.params.id).populate('category', 'category_name')
    if (!product) {
        return res.status(400).json({ error: "Something went wrong", success: false })
    }
    res.send({ product, success: true })
}

// get products by category
exports.getProductsByCategory = async (req, res) => {
    let products = await ProductModel.find({ category: req.params.categoryId }).populate('category', 'category_name')
    if (!products) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send({ products, success: true })
}

// update product
exports.updateProduct = async (req, res) => {

    if (req.file) {
        let product = await ProductModel.findById(req.params.id)
        if (fs.existsSync(product.product_image)) {
            fs.unlinkSync(product.product_image)
        }
    }
    let productToUpdate = await ProductModel.findByIdAndUpdate(req.params.id, {
        product_name: req.body.product_name,
        product_price: req.body.product_price,
        product_description: req.body.product_description,
        count_in_stock: req.body.count_in_stock,
        category: req.body.category,
        rating: req.body.rating,
        product_image: req.file?.path
    }, { new: true })
    if (!productToUpdate) {
        return res.status(400).json({ error: "Failed to update" })
    }
    res.send({ productToUpdate, success: true, message: "Product updated successfully" })
}

// delete product
exports.deleteProduct = (req, res) => {
    ProductModel.findByIdAndDelete(req.params.id)
        .then((deletedProduct) => {
            if (!deletedProduct) {
                return res.status(400).json({ error: "Product not found" })
            }
            if (fs.existsSync(deletedProduct.product_image)) {
                fs.unlinkSync(deletedProduct.product_image)
            }
            res.send({ success: true, message: "Product deleted successfully" })
        })
        .catch((error) => {
            return res.status(400).json({ error: error.message })
        })
}

// get filtered products
exports.getFilteredProducts = async (req, res) => {
    // req.body - {category: [a, b, c] , product_price: [lo, up]}
    let filters = {}

    for (var key in req.body) {
        if (req.body[key].length > 0) {
            if (key === 'category') {
                filters[key] = req.body[key]
            }
            else {
                filters[key] = {
                    '$gte': req.body[key][0],
                    '$lte': req.body[key][1]
                }
            }
        }
    }

    let products = await ProductModel.find(filters).populate('category')

    if (!products) {
        return res.status(400).json({ error: "SOmething went wrong" })
    }
    res.send({ products })
}

// related products
exports.getRelatedProducts = async (req, res) => {
    let product = await ProductModel.findById(req.params.id)
    if (!product) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    let products = await ProductModel.find({
        category: product.category,
        _id: { '$ne': product._id }
    })
    if (!products) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send({products})
}