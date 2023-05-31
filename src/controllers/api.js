const Database = require("../functions/queryDB.js");
const validate = require("../functions/validator.js");
const fs = require('fs')

module.exports = {
    profile: {
        get: async (req, res) => {
            const {error, value} = validate.id(req.query.id)
            if (error) throw error

            return res.send(await Database.profile.get(value))
        },
        getList: async (req, res) => {
            return res.send(await Database.profile.getList())
        },
        insert: async (req, res) => {
            try {
                // Constrói as entradas
                var data = JSON.parse(req.body.data)
                if (req.file) data['picture'] = req.file.filename 
    
                // Valida todas as entradas
                const {error, value} = validate.insert(data)
                if (error) throw error

                return res.send(await Database.profile.insert(value))
            } catch (err) {
                // Deleta arquivo caso ele tenha sido baixado
                if (req.file) fs.unlink(req.file.path, (err) => {
                    if (err) console.error('Erro ao deletar o arquivo:', err)
                });

                throw err
            }
        },
        update: async (req, res) => {
            const {error, value} = validate.update(req.body)
            if (error) throw error

            return res.send(await Database.profile.update(value))
        },
        delete: async (req, res) => {
            const {error, value} = validate.id(req.body.id)
            if (error) throw error

            return res.send(await Database.profile.delete(value))
        }
    }
}