const multer = require("multer");
const Database = require("../functions/queryDB.js");
const validate = require("../functions/validator.js");
const upload = require("../middleware/upload.js");
const fs = require('fs')

module.exports = {
    profile: {
        get: async (req, res) => {
            const {error, value} = validate.profile.id(req.query.id)
            if (error) throw error

            return res.send(await Database.profile.get(value))
        },
        getList: async (req, res) => {
            return res.send(await Database.profile.getList())
        },
        insert: async (req, res) => {    
            const {error, value} = validate.profile.insert(req.body)
            if (error) throw error

            return res.send(await Database.profile.insert(value))
        },
        update: async (req, res) => {
            const {error, value} = validate.profile.update(req.body)
            if (error) throw error

            return res.send(await Database.profile.update(value))
        },
        delete: async (req, res) => {
            const {error, value} = validate.profile.id(req.body.id)
            if (error) throw error

            return res.send(await Database.profile.delete(value))
        }
    },
    homePage: {
        getAll: async (req, res) => {
            return res.send(await Database.homePage.get())
        },
        insert: async (req, res) => {
            const {error, value} = validate.homePage.insert(req.body)
            if (error) throw error
          
            return res.send(await Database.homePage.insert(value.id, value.order))
        },
        delete: async (req, res) => {
            const {error, value} = validate.homePage.order(req.body.order)
            if (error) throw error
          
            return res.send(await Database.homePage.delete(value))
        }
    },
    categories: {
        getAll: async (req, res) => {
            return res.send(await Database.categories.getAll())
        }
    },
    promotions: {
        getAll: async (req, res) => {
            return res.send(await Database.promotions.getAll())
        }
    },
    uploads: {
        upload: async (req, res) => {
            console.log(upload.getConfig)
            multer(upload.getConfig).single('file')(req, res, function (err) {
                if (err) {
                    // A Multer error occurred when uploading.
                    console.log('erro multer');
                    return res.status(500).json({err: 'Erro interno'})
                }

                if (!req.file) return res.status(409).json({err: 'Permitido apenas .png ou .jpg '})
                const filename = req.file.filename;
                res.status(200).json({"msg": "file uploaded.......", "filename": filename});
            })
        }
    }
}