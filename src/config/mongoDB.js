const { MongoClient } = require("mongodb");

const uri = process.env.MONGOURI
let singleton;
 
async function connect() {
    if (singleton) return singleton;
 
    const client = new MongoClient(uri);
    await client.connect();
 
    singleton = client.db('zahir_website');
    return singleton;
}

module.exports = { 
  connect
}