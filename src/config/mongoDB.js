const { MongoClient } = require("mongodb");
const { categoriesNotUsed } = require('../functions/query.js');

const uri = process.env.MONGOURI
let singleton;
 
async function connect() {
    if (singleton) return singleton;
 
    const client = new MongoClient(uri);
    await client.connect();
    
    singleton = client.db('zahir_website');
    configFunctions()
    
    return singleton;
}

async function connectSession() {
  const client = new MongoClient(uri)
  await client.connect();

  const session = client.startSession();
  const db = client.db('zahir_website');
  
  return {
    session,
    db
  }
}

function configFunctions() {
  const profilesCollection = singleton.collection('profile');

  const pipeline = [
    { $match: { $or: [
      { operationType: 'delete' },
      { operationType: 'replace' }
    ]}
    },
    { $project: { documentKey: true, operationType: true, fullDocument: true} }
  ];

  const changeStream = profilesCollection.watch(pipeline);
  changeStream.on('change', async (change) => {
    const deletedProfileId = change.documentKey._id;

    switch (change.operationType) {
      case 'delete': {
        verify.homePage.delete(deletedProfileId)
        // verify.categories.notUsed()
        return;
      }
      case 'replace': {
        if (change.fullDocument.promotion.active == false) verify.homePage.delete(deletedProfileId)
        // else if (change.fullDocument.promotion.title == undefined) verify.homePage.delete(deletedProfileId)
        // verify.categories.notUsed()
        return;
      }
    }
  });
}

// Jogar essas queryes pra dentro da queryDB, mas mantendo essa conexão ("singleton")
const verify = {
  categories: {
    notUsed: async () => {
      const categoriesCollection = singleton.collection('categories');
      const response = await categoriesCollection.aggregate(categoriesNotUsed()).toArray()
        
      categoriesCollection.deleteMany({_id: { $in: response.map(e => e._id) }})
        .then(() => console.log(`Categories deletadas com sucesso`))
        .catch(() => console.log('erro ao delete categories'))
    }
  },
  homePage: {
    delete: async (id) => {
      const carroselCollection = singleton.collection('home_page_promotions');
      carroselCollection.deleteOne({ id_profile: id })
        .then(() => console.log(`${id} removido da home_page_promotions`))
        .catch((err) => console.error(`Erro ao remover ${id} da home_page_promotion: ${err}`))
    }
  }
}

module.exports = { 
  connect,
  connectSession
}