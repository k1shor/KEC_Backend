const { addProduct, getAllProducts, getProductDetails, getProductsByCategory, updateProduct, deleteProduct } = require('../controller/productController')
const { isAdmin } = require('../middleware/authmiddleware')
const upload = require('../middleware/upload')

const router = require('express').Router()

router.post('/addproduct', isAdmin, upload.single('product_image'), addProduct)
router.get('/getallproducts', getAllProducts)
router.get('/getproductdetails/:id', getProductDetails)
router.get('/getproductsbycategory/:categoryId', getProductsByCategory)
router.put('/updateproduct/:id', isAdmin, upload.single('product_image'), updateProduct)

router.delete('/deleteproduct/:id', isAdmin, deleteProduct)

module.exports = router