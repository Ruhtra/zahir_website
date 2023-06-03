const { ObjectId } = require("mongodb");

const { connect } = require('../config/mongoDB.js')
const query = require("./query.js");
const { queryDB } = require('../Errors.js')

const f = require('../functions/functions.js')

const structure = (obj) => {
    let data = {
        picture: obj.picture,
        name: obj.name,
        resume: obj.resume,
        category: {
          type: obj.category.type
        },
        informations: obj.informations,
        telephones: {
          whatsapp: obj.telephones.whatsapp,
          telephone: obj.telephones.telephone
        },
        local: {
          cep: obj.local.cep,
          uf:  obj.local.uf,
          city: obj.local.city,
          neighborhood: obj.local.neighborhood,
          street: obj.local.street,
          number: obj.local.number,
          complement: obj.local.complement
        },
        movie: obj.movie,
    }
    data = f.removeEmptyValues(data)

    data['created'] = new Date()
    if (obj.promotion != undefined) data['promotion'] = new ObjectId(obj.promotion)
    if (obj.category.categories != undefined) data['category']['categories'] = obj.category.categories.map((e) => new ObjectId(e))

    return data
}


async function testConnect() {
    const db = await connect();
    await db.command({ ping: 1 })
    return ("  ~ Successfully connected to MongoDB!");
}

async function getLogin(username, password) {
    const db = await connect();
    return await db.collection('login').findOne({
        username: username,
        password: password
    }, { projection: { _id: 0 } })
}

const profile = {
    get: async (id) => {
        const db = await connect();
        return await db.collection('profile').aggregate(query.profile(new ObjectId(id))).toArray()
    },
    getList: async () => {
        const db = await connect();
        return await db.collection('profile').aggregate(query.listProfile()).toArray()
    },
    insert: async (data) => {
        const db = await connect();
        
        // validate ids
        let promises = []
        if (data.category.categories != undefined) {
            promises = data.category.categories.map(async (id) => {
                let find = await db.collection('categories').findOne({_id: new ObjectId(id)})
                if (!find) throw new Error(queryDB.profile.insert.categorieNotFound)
            })
        }
        if (data.promotion != undefined) {
            promises.push((async () => {
                let find = await db.collection('promotions').findOne({_id: new ObjectId(data.promotion)})
                if (!find) throw new Error(queryDB.profile.insert.promotionNotFound)
            })() )
        }
        await Promise.all(promises)

        return await db.collection('profile').insertOne(structure(data))
    },
    update: async (data) => {
        const db = await connect();
        
        // validate ids
        let promises = []
        if (data.category.categories != undefined) {
            promises = data.category.categories.map(async (id) => {
                let find = await db.collection('categories').findOne({_id: new ObjectId(id)})
                if (!find) throw new Error(queryDB.profile.insert.categorieNotFound)
            })
        }
        if (data.promotion != undefined) {
            promises.push((async () => {
                let find = await db.collection('promotions').findOne({_id: new ObjectId(data.promotion)})
                if (!find) throw new Error(queryDB.profile.insert.promotionNotFound)
            })() )
        }
        await Promise.all(promises)

        return await db.collection('profile').replaceOne(
            {_id: new ObjectId(data.id)}, structure(data)
        )
    },
    delete: async (id) => {
        const db = await connect();
        return await db.collection('profile').deleteOne({_id: new ObjectId(id)})
    }
}

const homePageProfile = {
    get: async () => {
        const db = await connect();
        return await db.collection('home_page_promotions').aggregate(homePageProfile()).toArray()
    },
    insert: async (id, order) => {
        const db = await connect();

        let hppOrder = await db.collection('home_page_promotions').find(
            {order: order}, {projection: {_id: 0}}
        ).toArray()
        let hppProfile = await db.collection('home_page_promotions').find(
            {id_profile: new ObjectId(id)}, {projection: {_id: 0}}
        ).toArray()
        let profile = await db.collection('profile').findOne(
            {_id: new ObjectId(id)}, {projection: {_id: 1}}
        )


        if (hppOrder.length > 0) throw new Error(queryDB.homePageProfile.insert.occupiedOrder)
        if (hppProfile.length > 0) throw new Error(queryDB.homePageProfile.insert.occupiedProfile)
        if (profile == null) throw new Error(queryDB.homePageProfile.insert.profileNotFound)


        return await db.collection('home_page_promotions').insertOne({
            id_profile: new ObjectId(id),
            order: order
        })
    }
}

const promotions = {
    getAll: async () => {
        const db = await connect();
        return await db.collection('promotions').find({}).toArray()
    }
}
const categories = {
    getAll: async () => {
        const db = await connect();
        return await db.collection('categories').find({}).toArray()
    }
}

module.exports = {
    testConnect,
    getLogin,
    profile,
    homePageProfile,
    categories,
    promotions
}
