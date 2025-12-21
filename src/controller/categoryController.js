const CategoryModel = require('../models/categoryModel')

// add category
exports.addCategory = async (req, res) => {
    let categoryExists = await CategoryModel.findOne({
        category_name: req.body.category_name
    })
    if (categoryExists) {
        return res.status(400).json({ error: "Category already exists" })
    }
    let categoryToAdd = await CategoryModel.create({
        category_name: req.body.category_name
    })
    if (!categoryToAdd) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send({ category: categoryToAdd, success: true, message: "Category added successfully." })
}

exports.getAllCategories = async (req, res) => {
    let categories = await CategoryModel.find()
    if (!categories) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send({ categories, success: true })
}

exports.getCategoryDetails = async (req, res) => {
    let category = await CategoryModel.findById(req.params.id)
    if (!category) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send({ category, success: true })
}

exports.updateCategory = async (req, res) => {
    let categoryToUpdate = await CategoryModel.findByIdAndUpdate(req.params.id, {
        category_name: req.body.category_name
    }, { new: true })
    if (!categoryToUpdate) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send({
        categoryToUpdate,
        success: true,
        message: "Category updated successfully"
    })
}

// exports.deleteCategory = (req, res) => {
//     CategoryModel.findByIdAndDelete(req.params.id)
//         .then((categoryToDelete) => {
//             if (!categoryToDelete) {
//                 return res.status(400).json({ error: "Category not found" })
//             }
//             res.send({
//                 categoryToDelete,
//                 success: true,
//                 message: 'Category deleted successfully'
//             })
//         })
//         .catch((error) => res.status(400).json({ error: error.message }))
// }
exports.deleteCategory = async (req, res) => {
    try{
        let categoryToDelete = await CategoryModel.findByIdAndDelete(req.params.id)
        if(!categoryToDelete){
            return res.status(400).json({error:"Something went wrong"})
        }
        res.send({
            categoryToDelete,
            success: true,
            message: 'Category deleted successfully'
        })
    }
    catch(error){
        return res.status(400).json({ error: error.message })
    }
}

/*
CRUD Operations
    Create
        Model.create(obj) -> inserts obj into the collection(table)

    Retrieve
        Model.find() -> returns all documents/data
        Model.find(filterObj) -> returns all documents that matches filterObj

        Model.findById(id) -> returns a document with the given id

        Model.findOne(filterObj) -> returns first document that matches filterObj

    Update
        Model.findByIdAndUpdate(id, UpdatingObj) -> id of document to be updated, updatingObj -> the updated document

    Delete
        Model.findByIdAndDelete(id) -> removes document with given id


       request -> to get data from user
        request.body -> form is passed through body of a form
        request.params -> data is passed through url, eg: profile
        request.query -> data is passed through url using variables in frontend, eg: search 

    response -> 
        response.status(statusCode).send(data) ->
            data -> string, number, boolean, object, ...
        response.status(statusCode).json(jsonObject) ->
            jsonObject -> {key: value}

    statusCode ->
        200 : OK (default)
        300/301 : relay
        400 : Bad request
        401 : unauthorized error
        403 : forbidden
        404 : not found error
        500 : server error
*/