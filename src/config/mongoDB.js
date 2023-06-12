const { MongoClient } = require("mongodb");

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

function configFunctions() {
  const profilesCollection = singleton.collection('profile');
  const carroselCollection = singleton.collection('home_page_promotions');

  const pipeline = [
    { $match: { operationType: 'delete' } },
    { $project: { documentKey: true } }
  ];

  const changeStream = profilesCollection.watch(pipeline);
  changeStream.on('change', (change) => {
    const deletedProfileId = change.documentKey._id;

    carroselCollection.deleteOne({ id_profile: deletedProfileId })
      .then(() => console.log(`${deletedProfileId} removido da home_page_promotions`))
      .catch((err) => console.error(`Erro ao remover ${deletedProfileId} da home_page_promotion: ${err}`))
  });
}

module.exports = { 
  connect
}