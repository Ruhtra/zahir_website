const { ObjectId } = require("mongodb");

const bucket = require("./consumerBucket.js");
const { connect, connectSession } = require('../config/mongoDB.js')
const query = require("./query.js");
const { queryDB } = require('../Errors.js')

const f = require('../functions/functions.js');
const { getLocaleByCep } = require('../functions/GetLocaleFunctions.js')

const structure = (obj, typeFunction) => {
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
          complement: obj.local.complement,
          lat: obj.local.lat,
          lng: obj.local.lng
        },
        movie: obj.movie,
        promotion: {
            title: obj.promotion.title,
            description: obj.promotion.description
        }
    }
    data = f.removeEmptyValues(data)

    if (obj.createdAt == undefined) data['createdAt'] = new Date()
    else data['createdAt'] = obj.createdAt 

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
        let res = await db.collection('profile')
            .aggregate(query.listProfile()).
            sort({ "name": 1 })    
        .toArray()

        return res
    },
    insert: async (data, file) => {
        const { session, db } = await connectSession();
        try {
            session.startTransaction();

            // validate ids
            if (data.category.categories != undefined) {
                promises = data.category.categories.map(async (id) => {
                    let find = await db.collection('categories').findOne({_id: new ObjectId(id)})
                    if (!find) throw new Error(queryDB.profile.insert.categorieNotFound)
                })
                await Promise.all(promises);
            }

            // insert new categories
            var rCategories
            if (data.category.newCategories != undefined) {
                let names = data.category.newCategories.map(e => {return {name: e}})
                if (names.length > 0) {
                    rCategories = await db.collection('categories').insertMany(names)
        
                    Object.values(rCategories.insertedIds).forEach(e => {
                        data.category.categories.push(e.toString())
                    })
                }
            }

            var lat_log = await getLocaleByCep(data.local.cep)
            data.local.lat = lat_log.lat
            data.local.lng = lat_log.lng

            try {
                // verified file
                if (file) {
                    let resbkt = await bucket.insert(file) // upload image for aws
                    data.picture = resbkt // inserted _id in profile
                }
                let response = await db.collection('profile').insertOne(structure(data, 'insert'))
                
                await session.commitTransaction();
                return response
            } catch (err) {
                //deletar imagem do s3 caso haja algum erro
                await session.abortTransaction();
                throw err
            }
        } finally { session.endSession(); }
    },
    update: async (data, file) => {
        const { session, db } = await connectSession();
        try {
            session.startTransaction();
            try {
                let item = await db.collection('profile').findOne({_id: new ObjectId(data.id)})
                if (item == undefined) throw new Error('perfil não encontrado')

                //Atribui data de criação
                if (item.createdAt != undefined) data.createdAt = item.createdAt
            
                // validate ids
                if (data.category.categories != undefined) {
                    promises = data.category.categories.map(async (id) => {
                        let find = await db.collection('categories').findOne({_id: new ObjectId(id)})
                        if (!find) throw new Error(queryDB.profile.insert.categorieNotFound)
                    })
                }

                // insert new categories
                if (data.category.newCategories != undefined) {
                    let names = data.category.newCategories.map(e => {return {name: e}})
                    if (names.length > 0) {
                        let response = await db.collection('categories').insertMany(names)
            
                        Object.values(response.insertedIds).forEach(e => {
                            data.category.categories.push(e.toString())
                        })            
                    }
                }


                var lat_log = await getLocaleByCep(data.local.cep)
                data.local.lat = lat_log.lat
                data.local.lng = lat_log.lng

                //verified file
                if (file) {
                    //verified if item exists file
                    if (item.picture != undefined) await bucket.delete(item.picture.key)
                    let resbkt = await bucket.insert(file) // upload image for aws
                    data.picture = resbkt // inserted _id in profile
                } else {
                    //copy picture
                    if (item.picture != undefined) data.picture = item.picture
                }

                let response =  await db.collection('profile').replaceOne(
                    {_id: new ObjectId(data.id)}, structure(data, 'update')
                )
                    
                //remove categories
                const categoriesCollection = db.collection('categories');
                const cat = await categoriesCollection.aggregate(query.categoriesNotUsed()).toArray()
                    
                await categoriesCollection.deleteMany({_id: { $in: cat.map(e => e._id) }})
                console.log(`Categories deletadas com sucesso`)

                await session.commitTransaction();
                return response
            } catch(err) {
                //deletar imagem do s3 caso haja algum erro
                await session.abortTransaction();
                throw err
            }
        } finally { session.endSession(); }
    },
    delete: async (id) => {
        const { session, db } = await connectSession();
        try {
            session.startTransaction();

            try {
                let item = await db.collection('profile').findOne({_id: new ObjectId(id)})
                let response =  await db.collection('profile').deleteOne({_id: new ObjectId(id)})
            
                //remove categories
                const categoriesCollection = db.collection('categories');
                const cat = await categoriesCollection.aggregate(query.categoriesNotUsed()).toArray()
                    
                await categoriesCollection.deleteMany({_id: { $in: cat.map(e => e._id) }})
                console.log(`Categories deletadas com sucesso`)

                if (item.picture != undefined) await bucket.delete(item.picture.key)
    
                await session.commitTransaction();
                return response
            } catch(err) {
                //deletar imagem do s3 caso haja algum erro
                await session.abortTransaction();
                throw err
            }
            
        } finally { session.endSession(); }
    },
    recents: async () => {
        // internal
        const db = await connect();

        return await db.collection('profile')
            .find({movie: { $exists: 1, $ne: null }})
            .project({ movie: 1  })
            .sort({ createdAt: -1 })
            .limit(4)
        .toArray()
    }
}

const homePage = {
    get: async () => {
        const db = await connect();
        return await db.collection('home_page_promotions').aggregate(query.homePageProfile()).toArray()
    },
    insert: async (id, order) => {
        const db = await connect();

        // validate values
        let promises = []
        promises.push((async () => {
            let hppOrder = await db.collection('home_page_promotions').find( {order: order}, {projection: {_id: 0}} ).toArray()
            if (hppOrder.length > 0)  throw new Error(queryDB.homePageProfile.insert.occupiedOrder)
        })() )
        promises.push((async () => {
            let hppProfile = await db.collection('home_page_promotions').find( {id_profile: new ObjectId(id)}, {projection: {_id: 0}} ).toArray()
            if (hppProfile.length > 0) throw new Error(queryDB.homePageProfile.insert.occupiedProfile)
        })() )
        promises.push((async () => {
            let profile = await db.collection('profile').findOne( {_id: new ObjectId(id)}, {projection: {_id: 1, promotion: 1}} )  
            if (profile == null) throw new Error(queryDB.homePageProfile.insert.profileNotFound)
            if (Object.keys(profile.promotion).length == 0) throw new Error(queryDB.homePageProfile.insert.promotionIsRequired)
        })() )

        await Promise.all(promises)

        return await db.collection('home_page_promotions').insertOne({
            id_profile: new ObjectId(id),
            order: order
        })
    },
    delete: async (order) => {
        const db = await connect();

        let hppOrder = await db.collection('home_page_promotions').find(
            {order: order}, {projection: {_id: 0}}
        ).toArray()

        if (hppOrder.length == 0) throw new Error(queryDB.homePageProfile.delete.ordertNotFound)

        return await db.collection('home_page_promotions').deleteOne({order: order})
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

const auth = {
    login: async (username, password) => {
        const db = await connect();
        return await db.collection('login').findOne({
            username: username, 
            password: password
        })
    }
}

module.exports = {
    testConnect,
    getLogin,
    profile,
    homePage,
    categories,
    promotions,
    auth
}