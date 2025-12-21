const express = require('express')
const { addCategory, getAllCategories, getCategoryDetails, updateCategory, deleteCategory } = require('../controller/categoryController')
const { isLoggedIn, isAdmin } = require('../middleware/authmiddleware')
const { categoryCheck, validationMethod } = require('../middleware/validationScript')
const router = express.Router()

router.post('/addcategory', isAdmin, categoryCheck, validationMethod, addCategory)
router.get('/getallcategories', getAllCategories)
router.get('/getcategory/:id', getCategoryDetails)
router.put('/updatecategory/:id', isAdmin, updateCategory)
router.delete('/deletecategory/:id', isAdmin, deleteCategory)

// router.post('/', addCategory)
// router.get('/', getAllCategories)
// router.get('/:id', getCategoryDetails)
// router.put('/:id', updateCategory)
// router.delete('/:id', deleteCategory)


module.exports = router