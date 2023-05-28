const Database = require("../functions/queryDB.js");
const { verifyInput } = require("../Errors.js");
const infos = require('../config/infos.json');
const { ObjectId } = require("mongodb");

function isNumber(n) {
    if (!n) return false
    if (n.slice(0, 3) != '+55') return false
    if (n.slice(3, 5).length != '2') return false
    if (n.slice(5, 6) != '9') return false
    if (n.slice(6).length != 8 ) return false
    return true
}
function validation(data) {
    // picture: req.body.picture,
    data.name = (data.name || '').trim()
    data.resume = (data.resume || '').trim()
    data.category.type = (data.category.type || '').trim()
    data.category.categories = (data.category.categories || [])
    data.informations = (data.informations || '').trim()
    data.telephone.telephone = (data.telephone.telephone || [])
    data.telephone.whatsapp = (data.telephone.whatsapp || [])
    data.local.cep = (data.local.cep || '').trim()
    data.local.uf =  (data.local.uf || '').trim()
    data.local.city = (data.local.city || '').trim()
    data.local.neighborhood = (data.local.neighborhood || '').trim(),
    data.local.street = (data.local.street || '').trim(),
    data.local.number = (data.local.number || '').trim(),
    data.local.complement = (data.local.complement || '').trim(),
    // data.movie = data.movie,
    data.promotion = (data.promotion || '').trim()



    // name 
    if (!data.name) throw new Error(verifyInput.name.IsEmpy)
    if (data.name.length >= infos.name.maxCaractere) throw new Error(verifyInput.name.maxCaractere)
    // resume
    if (!data.resume) throw new Error(verifyInput.resume.IsEmpy)
    if (data.resume.length >= infos.resume.maxCaractere) throw new Error(verifyInput.resume.maxCaractere)
    // category
        // type
        if (!data.category.type) throw new Error(verifyInput.category.type.IsEmpy)
        if (infos.category.type.indexOf(data.category.type) == -1) throw new Error(verifyInput.category.type.notValid)
        // categories
        for (const id of data.category.categories) {
            if (!ObjectId.isValid(id)) throw new Error(verifyInput.category.categories.invalid)
        }
    // telephone
    let listPhone = Object.values(data.telephone).reduce((t, v) => { return t.concat(v); }, []);
    for (const id of listPhone) {
        if (!isNumber(id)) throw new Error(verifyInput.telephone.invalid)
    }
    // local
        // cep
            if (!data.local.cep) throw new Error(verifyInput.local.cep.IsEmpy)
            if (!Number.isInteger(Number(data.local.cep))) throw new Error(verifyInput.local.cep.notNumber)
            if (data.local.cep.length != infos.local.cep.lenCaractere) throw new Error(verifyInput.local.cep.lenCaractere) 
        // uf
            if (!data.local.uf) throw new Error(verifyInput.local.uf.IsEmpy)
            if (data.local.uf.length != 2) throw new Error(verifyInput.local.uf.invalid) 
        // city
            if (!data.local.city) throw new Error(verifyInput.local.city.IsEmpy)
            if (data.local.city.length >= infos.local.city.maxCaractere) throw new Error(verifyInput.local.city.maxCaractere) 
        // neighborhood
            if (!data.local.neighborhood) throw new Error(verifyInput.local.neighborhood.IsEmpy)
            if (data.local.neighborhood.length >= infos.local.neighborhood.maxCaractere) throw new Error(verifyInput.local.neighborhood.maxCaractere) 
        // street
            if (!data.local.street) throw new Error(verifyInput.local.street.IsEmpy)
            if (data.local.street.length >= infos.local.street.maxCaractere) throw new Error(verifyInput.local.street.maxCaractere) 
        // number
            if (!data.local.number) throw new Error(verifyInput.local.number.IsEmpy)
            if (!Number.isInteger(Number(data.local.number))) throw new Error(verifyInput.local.number.notNumber)
            if (data.local.number.length >= infos.local.number.maxCaractere) throw new Error(verifyInput.local.number.maxCaractere) 
        // complement
            if (data.local.complement.length >= infos.local.complement.maxCaractere) throw new Error(verifyInput.local.complement.maxCaractere) 

    // promotion
    if (!data.promotion) throw new Error(verifyInput.promotion.IsEmpy)
    if (!ObjectId.isValid(data.promotion)) throw new Error(verifyInput.promotion.invalid)

    return data
}

module.exports = {
    profile: {
        get: async (req, res) => {
            let { id } = req.query || ''

            let data = await Database.profile.get(id)
            return res.send(data)
        },
        getList: async (req, res) => {
            return res.send(await Database.profile.getList())
        },
        insert: async (req, res) => {
            var data = {
                picture: req.body.picture,
                name:  req.body.name,
                resume:  req.body.resume,
                category: {
                    type: req.body.category.type,
                    categories:  req.body.category.categories
                },
                informations:  req.body.informations,
                telephone: {
                    whatsapp:  req.body.telephone.whatsapp,
                    telephone:  req.body.telephone.telephone
                },
                local: {
                    cep:  req.body.local.cep,
                    uf:  req.body.local.uf,
                    city:  req.body.local.city,
                    neighborhood:  req.body.local.neighborhood,
                    street:  req.body.local.street,
                    number:  req.body.local.number,
                    complement:  req.body.local.complement
                },
                movie:  req.body.movie,
                promotion:  req.body.promotion
            }
            // Validation input datas
            try { data = validation(data) }
            catch (err) { throw err }
            
            // Insert data
            Database.profile.insert(data)
                .then((resp) => {
                    return res.send(resp)
                })
                .catch(err => {
                    throw err
                })
        },
        update: async (req, res) => {
            var data = {
                picture: req.body.picture,
                name:  req.body.name,
                resume:  req.body.resume,
                category: {
                    type: req.body.category.type,
                    categories:  req.body.category.categories
                },
                informations:  req.body.informations,
                telephone: {
                    whatsapp:  req.body.telephone.whatsapp,
                    telephone:  req.body.telephone.telephone
                },
                local: {
                    cep:  req.body.local.cep,
                    uf:  req.body.local.uf,
                    city:  req.body.local.city,
                    neighborhood:  req.body.local.neighborhood,
                    street:  req.body.local.street,
                    number:  req.body.local.number,
                    complement:  req.body.local.complement
                },
                movie:  req.body.movie,
                promotion:  req.body.promotion
            }
            // get id
            const id = (req.body._id || '').trim()
            if (!id) throw new Error(verifyInput.id.IsEmpy)
            if (!ObjectId.isValid(id)) throw new Error(verifyInput.id.invalid)

            
            // Validation input datas
            try { data = validation(data) }
            catch (err) { throw err }

            // Update data
                Database.profile.update(id, data)
                .then((resp) => {
                    return res.send(resp)
                })
                .catch(err => {
                    throw err
                })
        },
        delete: async (req, res) => {
            var id = (req.body.id || '').trim()
            if (!id) throw new Error(verifyInput.id.IsEmpy)
            if (!ObjectId.isValid(id)) throw new Error(verifyInput.id.invalid)

            Database.profile.delete(id)
                .then((resp) => {
                    return res.send(resp)
                })
                .catch(err => {
                    throw err
                })
        }
    }
}