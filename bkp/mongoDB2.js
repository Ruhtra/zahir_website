const { MongoClient, ObjectId } = require("mongodb")

const uri = process.env.MONGOURI

module.exports.getListProfiles = async () => {
  try {
    var client = new MongoClient(uri);
    await client.connect();
    return await client.db('zahir_website').collection('profile').aggregate([
      {
        $lookup: {
          from: "promotions",
          localField: "promotion",
          foreignField: "_id",
          as: "promoDocs",
        }
      }, {
        $lookup: {
          from: "categories",
          localField: "category.categories",
          foreignField: "_id",
          as: "categoryDocs",
        }
      }, {
        $project: {
          _id: 0,
          uf: "$local.uf",
          name: 1,
          picture: 1,
          category: {
            type: 1,
            categories: "$categoryDocs.name"
          },
          promotion: "$promoDocs.percentage",
        }
      },
      { $unwind: "$promotion" },
    ]).toArray()
  } catch (err) { console.log(err) } finally { await client.close() }
}
module.exports.getProfile = async (id) => {
  try {
    var client = new MongoClient(uri);
    await client.connect();
    return await client.db('zahir_website').collection('profile').aggregate([
      {$match: {_id: new ObjectId(id)}},
      {
        $lookup: {
          from: "promotions",
          localField: "promotion",
          foreignField: "_id",
          as: "promoDocs",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category.categories",
          foreignField: "_id",
          as: "categoryDocs",
        },
      },
      {
        $project: {
          _id: 0,
          created: 1,
          informations: 1,
          telephone: 1,
          local: 1,
          movie: 1,
          picture: 1,
          resume: 1,
          category: {
            type: 1,
            categories: "$categoryDocs.name"
          },
          promotion: "$promoDocs.percentage",
        },
      },
      { $unwind: "$promotion" },
    ]).toArray()
  } catch (err) { console.log(err) } finally { await client.close() }
}
module.exports.testConnect = async () => {
  try {
    var client = new MongoClient(uri);
    await client.connect();
    await client.db("admin").command({ ping: 1 })
    return ("  ~ Successfully connected to MongoDB!");
  } finally {  await client.close() }
}

// [
//   {
//     $lookup: {
//       from: "promotions",
//       localField: "promotion",
//       foreignField: "_id",
//       as: "promoDocs",
//     },
//   },
//   {
//     $lookup: {
//       from: "categories",
//       localField: "category.categories",
//       foreignField: "_id",
//       as: "categoryDocs",
//     },
//   },
//   {
//     $project: {
//       _id: 0,
//       created: 1,
//       informations: 1,
//       telephone: 1,
//       local: 1,
//       movie: 1,
//       picture: 1,
//       resume: 1,
//       // category: 1,
//       category: {
//         type: 1,
//         categories: "$categoryDocs.name"
//       },
//       promotion: "$promoDocs.percentage",
//     },
//   },
//   { $unwind: "$promotion" },
// ]