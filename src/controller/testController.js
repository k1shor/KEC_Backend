// non default export
exports.testFunction = (request, response)=>{
    response.send({message: "Good Afternoon!!!"})
}

exports.another = (req, res) => {
    res.send("HI THERE")
}

// default export
// module.exports = testFunction