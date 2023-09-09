
const mime = require('mime-types');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

class Upload {
    URL = path.join(process.cwd(), 'src', 'public', 'uploads').toString()

    constructor() {}

    storage() { return multer.memoryStorage() }
    
    fileFilter() {
        return (req, file, cb) => {
            const type = mime.extension(file.mimetype);
            const conditions = ["png", "jpg", "jpeg"];
            
            if (conditions.includes(`${type}`)) return cb(null, true);
            return cb(null, false)
            // const err = new Error();
            // err.name = "ExtensionError";
            // err.message = 'Only .png, .jpg, jpeg format allowed';
            // return cb(err)
        }
    }

    get getConfig() {
        return {
            limits: {fileSize : 2 * 1024 * 1024},
            storage: this.storage(),
            fileFilter: this.fileFilter()
        };
    }
}

module.exports = new Upload()

