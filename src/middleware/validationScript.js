const { check, validationResult } = require('express-validator')

exports.categoryCheck = [
    check('category_name', "Category Name is required").notEmpty()
        .isLength({ min: 3 }).withMessage("Category name must be at least 3 characters")
        .isLength({ max: 15 }).withMessage("Category name must not exceed 15 characters")
        .isAlpha().withMessage("Category must only be alphabets")
        .not().matches(/test/).withMessage("Category name consist of invalid characters")
]

exports.categoryUpdateCheck = [
    check('category_name').optional()
        .isLength({ min: 3 }).withMessage("Category name must be at least 3 characters")
        .isLength({ max: 15 }).withMessage("Category name must not exceed 15 characters")
        .isAlpha().withMessage("Category must only be alphabets")
        .not().matches(/test/).withMessage("Category name consist of invalid characters")
]

exports.validationMethod = (req, res, next) => {
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg })
    }
    next()
}

exports.productCheck = [
    check('product_name', "Product Name is required").notEmpty()
        .isLength({ min: 3 }).withMessage("Product name must be at least 3 characters")
        .isLength({ max: 15 }).withMessage("Product name must not exceed 15 characters")
        .isAlphanumeric().withMessage("Product must only be alphabets and numbers")
        .not().matches(/test/).withMessage("Product name consist of invalid characters"),
    check('product_price', "Price is required").notEmpty()
        .isNumeric().withMessage('Price must be a number'),
    check('product_description', "Description is requried").notEmpty()
        .isLength({ min: 20 }).withMessage("Description must be at least 20 characters"),
    check('count_in_stock', "Count in stock is required").notEmpty()
        .isNumeric().withMessage('Count must be a number'),
    check('category', "Category is required").notEmpty()
        .isMongoId().withMessage("Invalid category")
]
exports.productUpdateCheck = [
    check('product_name').optional()
        .isLength({ min: 3 }).withMessage("Product name must be at least 3 characters")
        .isLength({ max: 15 }).withMessage("Product name must not exceed 15 characters")
        .isAlphanumeric().withMessage("Product must only be alphabets and numbers")
        .not().matches(/test/).withMessage("Product name consist of invalid characters"),
    check('product_price').optional()
        .isNumeric().withMessage('Price must be a number'),
    check('product_description').optional()
        .isLength({ min: 20 }).withMessage("Description must be at least 20 characters"),
    check('count_in_stock').optional()
        .isNumeric().withMessage('Count must be a number'),
    check('category').optional()
        .isMongoId().withMessage("Invalid category")
]


exports.userCheck = [
    check('username', "Username is required").notEmpty()
        .isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),
    check('email', "email is required").notEmpty()
        .isEmail().withMessage("Email format incorrect"),
    check('password', "password is required").notEmpty()
        .matches(/[a-z]/).withMessage("Password must contain at least 1 lowercase alphabet")
        .matches(/[A-Z]/).withMessage("Password must contain at least 1 uppercase alphabet")
        .matches(/[0-9]/).withMessage("Password must contain at least 1 number")
        .matches(/[!@#$%^]/).withMessage("Password must contain at least 1 special character")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 character")
        .isLength({ max: 15 }).withMessage("Password must not exceed 15 character")
]