const Database = require("../functions/queryDB.js");
const validate = require("../functions/validator.js");
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
            return res.send(await Database.homePageProfile.get())
        },
        insert: async (req, res) => {
            const {error, value} = validate.homePageProfile.insert(req.body)
            if (error) throw error
          
            return res.send(await Database.homePageProfile.insert(value.id, value.order))
        }
    }
}