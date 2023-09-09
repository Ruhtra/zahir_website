const Database = require("../functions/queryDB.js");
const validate = require("../functions/validator.js");
const crypto = require("crypto")
const fs = require('fs')

const verifyJson = async (json) => {
    return new Promise((resolve, reject) => {
        try {
            if (!json) return resolve(undefined)
            return resolve(JSON.parse(json))
        }
        catch (e) { reject(e) }
    })
};

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
            var { file } = req
            var { json } = req.body
            
            if (file) file.filename = `${crypto.randomBytes(16).toString('hex')}-${file.originalname}`

            var jsonConverse = await verifyJson(json)

            const {error, value} = validate.profile.insert(jsonConverse)
            if (error) throw error
        
            return res.send(await Database.profile.insert(value, file))
        },
        update: async (req, res) => {
            var { file } = req
            var { json } = req.body
            
            if (file) file.filename = `${crypto.randomBytes(16).toString('hex')}-${file.originalname}`

            var jsonConverse = await verifyJson(json)

            const {error, value} = validate.profile.update(jsonConverse)
            if (error) throw error

            return res.send(await Database.profile.update(value, file))
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
    }
}