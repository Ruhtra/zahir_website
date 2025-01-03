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
        // local: {
        //     cep: obj.local.cep,
        //     uf: obj.local.uf,
        //     city: obj.local.city,
        //     neighborhood: obj.local.neighborhood,
        //     street: obj.local.street,
        //     number: obj.local.number,
        //     complement: obj.local.complement,
        //     lat: obj.local.lat,
        //     lng: obj.local.lng
        // },
        movie: obj.movie,
        promotion: {
            active: obj.promotion.active,
            title: obj.promotion.title,
            description: obj.promotion.description
        }
    }
    data = f.removeEmptyValues(data)

    if (obj.createdAt == undefined) data['createdAt'] = new Date()
    else data['createdAt'] = obj.createdAt

    if (obj.category.categories != undefined) data['category']['categories'] = obj.category.categories.map((e) => new ObjectId(e))

    if (obj.local != undefined) data['local'] = obj.local
    return data
}

async function getLatLng(cep) {
    let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${cep}&key=${key}`

    const response_lat_log = await axios.get(url);
    if (response_lat_log.status <= 200 && response_lat_log.status > 300) throw new Error(`Erro ao consumir API do Google Maps`);
    if (response_lat_log.data.results.length <= 0) throw new Error('Não foi possivel encontrar o cep específicado');

    return response_lat_log.data.results[0].geometry.location
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
                    let find = await db.collection('categories').findOne({ _id: new ObjectId(id) })
                    if (!find) throw new Error(queryDB.profile.insert.categorieNotFound)
                })
                await Promise.all(promises);
            }

            // insert new categories
            var rCategories
            if (data.category.newCategories != undefined) {
                let names = data.category.newCategories.map(e => { return { name: e } })
                if (names.length > 0) {
                    rCategories = await db.collection('categories').insertMany(names)

                    Object.values(rCategories.insertedIds).forEach(e => {
                        data.category.categories.push(e.toString())
                    })
                }
            }

            if (data.local != undefined) {
                var lat_log = await getLocaleByCep(data.local.cep)
                data.local.lat = lat_log.lat
                data.local.lng = lat_log.lng
            }

          

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
                let item = await db.collection('profile').findOne({ _id: new ObjectId(data.id) })
                if (item == undefined) throw new Error('perfil não encontrado')

                //Atribui data de criação
                if (item.createdAt != undefined) data.createdAt = item.createdAt

                // validate ids
                if (data.category.categories != undefined) {
                    promises = data.category.categories.map(async (id) => {
                        let find = await db.collection('categories').findOne({ _id: new ObjectId(id) })
                        if (!find) throw new Error(queryDB.profile.insert.categorieNotFound)
                    })
                }

                // insert new categories
                if (data.category.newCategories != undefined) {
                    let names = data.category.newCategories.map(e => { return { name: e } })
                    if (names.length > 0) {
                        let response = await db.collection('categories').insertMany(names)

                        Object.values(response.insertedIds).forEach(e => {
                            data.category.categories.push(e.toString())
                        })
                    }
                }


                if (data.local != undefined) {
                    var lat_log = await getLocaleByCep(data.local.cep)
                    data.local.lat = lat_log.lat
                    data.local.lng = lat_log.lng
                }

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

                let response = await db.collection('profile').replaceOne(
                    { _id: new ObjectId(data.id) }, structure(data, 'update')
                )

                //remove categories
                const categoriesCollection = db.collection('categories');
                const cat = await categoriesCollection.aggregate(query.categoriesNotUsed()).toArray()

                await categoriesCollection.deleteMany({ _id: { $in: cat.map(e => e._id) } })
                console.log(`Categories deletadas com sucesso`)

                await session.commitTransaction();
                return response
            } catch (err) {
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
                let item = await db.collection('profile').findOne({ _id: new ObjectId(id) })
                let response = await db.collection('profile').deleteOne({ _id: new ObjectId(id) })

                //remove categories
                const categoriesCollection = db.collection('categories');
                const cat = await categoriesCollection.aggregate(query.categoriesNotUsed()).toArray()

                await categoriesCollection.deleteMany({ _id: { $in: cat.map(e => e._id) } })
                console.log(`Categories deletadas com sucesso`)

                if (item.picture != undefined) await bucket.delete(item.picture.key)

                await session.commitTransaction();
                return response
            } catch (err) {
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
            .find({ movie: { $exists: 1, $ne: null } })
            .project({ movie: 1 })
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
            let hppOrder = await db.collection('home_page_promotions').find({ order: order }, { projection: { _id: 0 } }).toArray()
            if (hppOrder.length > 0) throw new Error(queryDB.homePageProfile.insert.occupiedOrder)
        })())
        promises.push((async () => {
            let hppProfile = await db.collection('home_page_promotions').find({ id_profile: new ObjectId(id) }, { projection: { _id: 0 } }).toArray()
            if (hppProfile.length > 0) throw new Error(queryDB.homePageProfile.insert.occupiedProfile)
        })())
        promises.push((async () => {
            let profile = await db.collection('profile').findOne({ _id: new ObjectId(id) }, { projection: { _id: 1, promotion: 1 } })
            if (profile == null) throw new Error(queryDB.homePageProfile.insert.profileNotFound)
            if (Object.keys(profile.promotion).length == 0) throw new Error(queryDB.homePageProfile.insert.promotionIsRequired)
        })())

        await Promise.all(promises)

        return await db.collection('home_page_promotions').insertOne({
            id_profile: new ObjectId(id),
            order: order
        })
    },
    delete: async (order) => {
        const db = await connect();

        let hppOrder = await db.collection('home_page_promotions').find(
            { order: order }, { projection: { _id: 0 } }
        ).toArray()

        if (hppOrder.length == 0) throw new Error(queryDB.homePageProfile.delete.ordertNotFound)

        return await db.collection('home_page_promotions').deleteOne({ order: order })
    }
}

const googleUser = {
    model: function (data) {
        switch (data.role) {
            case "admin": break;
            default: data.role = "user"; break;
        }

        return {
            email: data.email,
            name: data.name,
            role: data.role, //admin or user
            picture: data.picture,
        }
    },
    findById: async function (id) {
        const db = await connect();
        return await db.collection("googleUser").findOne({ _id: new ObjectId(id) });
    },
    findByEmail: async function (email) {
        const db = await connect();
        return await db.collection("googleUser").findOne({ email: email });
    },
    updateUser: async function (id, user) {
        const db = await connect();
        let response = await db.collection('googleUser').updateOne(
            { _id: new ObjectId(id) },
            { "$set": this.model(user) }
        );
        return response;
    },
    createUser: async function (user) {
        if (!user) throw new Error("User undefined")
        const userFound = await this.findByEmail(user.email);
        if (userFound) throw new Error("Usuário já existe no banco");

        const db = await connect();
        return await db.collection('googleUser').insertOne(this.model(user));
    },
    createAndUpdateUser: async function (user) {
        const userFound = await this.findByEmail(user.email);
        user.role = userFound.role
        if (userFound) this.updateUser(userFound._id, user);
        else this.createUser(user);

        return await this.findByEmail(user.email);
    }
};


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


const followers = {
    setAll: async (instagramFollowers, tiktokFollowers, youtubeFollowers, totalFollowers) => {
        const db = await connect();  // Conectar ao banco de dados
        const collection = db.collection('followers');  // Defina o nome da sua coleção

        // Procurar o primeiro registro (se existir)
        const existingRecord = await collection.findOne({});

        if (existingRecord) {
            // Se o registro já existir, atualize o registro
            await collection.updateOne(
                {},  // Para garantir que estamos atualizando o primeiro (único) registro
                {
                    $set: {
                        instagram: instagramFollowers,
                        tiktok: tiktokFollowers,
                        youtube: youtubeFollowers,
                        total: totalFollowers
                    }
                }
            );
            console.log('Registro de seguidores atualizado!');
        } else {
            // Caso não exista nenhum registro, cria um novo
            await collection.insertOne({
                instagram: instagramFollowers,
                tiktok: tiktokFollowers,
                youtube: youtubeFollowers,
                total: totalFollowers
            });
            console.log('Novo registro de seguidores criado!');
        }
    },
    get: async () => {
        const db = await connect();  // Conectar ao banco de dados
        const collection = db.collection('followers');  // Defina o nome da sua coleção

        // Buscar o primeiro (único) registro na coleção
        const record = await collection.findOne({});

        if (record) return record;
        return null; 
    }
};

module.exports = {
    testConnect,
    getLogin,
    profile,
    homePage,
    categories,
    promotions,
    auth,
    googleUser,
    followers
}