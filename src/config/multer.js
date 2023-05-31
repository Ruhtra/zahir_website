const multer = require("multer")
const mime = require('mime')
const path = require('path')
const fs = require('fs')

const url = path.basename('upload'); 
  
function storage() {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            if (!fs.existsSync(url)) fs.mkdirSync(url);
            cb(null, url);
        },
        filename: (req, file, cb) => {
            const type = mime.getExtension(file.mimetype);
            cb(null, `${new Date().getTime()}.${type}`);
        },
    });
}
function fileFilter() {
    return ( req, file, cb ) => {
        const type = mime.getExtension(file.mimetype);
        const conditions = ["png", "jpg", "jpeg"];
    
        if (conditions.includes(`${type}`)) cb(null, true);
        cb(null, false);
    };
}
  
function getConfig() {
    return {
        storage: storage(),
        fileFilter: fileFilter(),
    }
}

module.exports = {
    getConfig
}