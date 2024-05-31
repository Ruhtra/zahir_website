
const { v4: uuidv4 } = require('uuid');

// bduser
const bd = []
module.exports.findUser = async function findUser(id) {
    const user = bd.find(e => e._id == id)
    return user
}
module.exports.findAndUpdateUserr =  async function findAndUpdateUser(query, update) {
    const index = bd.findIndex(e => e.email === query.email);

    if (index === -1) bd.push({_id: uuidv4(), ...update})
    else bd[index] = { ...bd[index], ...update };

    return bd.find(e => e.email === query.email);
}
