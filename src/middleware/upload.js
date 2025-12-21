const multer = require('multer')
const fs = require('fs') //file - system
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let file_destination = 'public/uploads'
        if (!fs.existsSync(file_destination)) {
            fs.mkdirSync(file_destination, { recursive: true })
        }
        cb(null, file_destination)
    },
    filename: function (req, file, cb) {
        // apple.jpeg
        // originalname: apple.jpeg
        // extname : jpeg
        // basename : apple
        let extname = path.extname(file.originalname)
        let basename = path.basename(file.originalname, extname)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)

        const filename = file.fieldname + '-' + basename + '-' + uniqueSuffix + extname

        cb(null, filename)
    }
})

const fileFilter = (req, file, cb) => {
    if(!file.originalname.match(/[.]jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|SVG|svg|webp|WEBP$/)){
        cb(new Error("File type invalid"), false)
    }
    cb(null, true)
}

const upload = multer({ 
    storage,
    limits: {
        fileSize: 2000000
    },
    fileFilter
})

module.exports = upload