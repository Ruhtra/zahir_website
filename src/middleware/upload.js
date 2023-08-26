
const mime = require('mime-types');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

class Upload {
    URL = path.join(process.cwd(), 'src', 'public', 'uploads').toString()

    constructor() {}

    storage() {
        return multer.diskStorage({
            destination: (req, file, cb) => {
                if (!fs.existsSync(this.URL)) fs.mkdirSync(this.URL);
                cb(null, this.URL)
            },
            filename: (req, file, cb) => {
                // console.log(file.originalname);
                //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
                cb(null, file.originalname)
            }
        })
    }

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

