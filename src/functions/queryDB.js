const { ObjectId } = require("mongodb");

const { connect } = require('../config/mongoDB.js')
const query = require("./query.js");
const { queryDB } = require('../Errors.js')

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

        let base = {
            created: new Date(),
            picture: data.picture,
            name: data.name,
            resume: data.resume,
            category: {
              type: data.category.type,
              categories: data.category.categories.map((e) => {
                return new ObjectId(e)
              })
            },
            informations: data.informations,
            telephone: {
              whatsapp: data.telephone.whatsapp,
              telephone: data.telephone.telephone
            },
            local: {
              cep: { "$numberInt": data.local.cep },
              uf:  data.local.uf,
              city: data.local.city,
              neighborhood: data.local.neighborhood,
              street: data.local.street,
              number: { "$numberInt": data.local.number },
              complement: data.local.complement
            },
            movie: data.movie,
            promotion: new ObjectId(data.promotion)
          }
        
       return await db.collection('profile').insertOne(base)
    },
    update: async (id, dataUpdate) => {
        const db = await connect();

        return await db.collection('profile').updateOne(
            {_id: new ObjectId(id)},
            { $set: dataUpdate }
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


        return await db.collection('home_page_promotions').insertOne(
            {
                id_profile: new ObjectId(id),
                order: order
            }
        )
    }
}



module.exports = {
    testConnect,
    getLogin,
    profile,
    homePageProfile
}
