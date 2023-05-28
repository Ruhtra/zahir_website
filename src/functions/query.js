module.exports.listProfile = () => { return [
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
      _id: 1,
      uf: "$local.uf",
      name: 1,
      picture: 1,
      category: {
        type: 1,
        categories: "$categoryDocs.name"
      },
      promotion: "$promoDocs.percentage",
    }
  }, { $unwind: "$promotion" }
]}
module.exports.profile = (id) => { return  [
  { $match: {_id: id} }, {
    $lookup: {
      from: "promotions",
      localField: "promotion",
      foreignField: "_id",
      as: "promoDocs",
    },
  }, {
    $lookup: {
      from: "categories",
      localField: "category.categories",
      foreignField: "_id",
      as: "categoryDocs",
    },
  }, {
    $project: {
      _id: 0,
      created: 1,
      name: 1,
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
  }, { $unwind: "$promotion" }, { $limit: 1 }
]}
module.exports.homePageProfile = () => { return [
  {
    $lookup: {
      from: "profile",
      localField: "id_profile",
      foreignField: "_id",
      as: "profile",
      pipeline: this.listProfile()
    }
  }, {
    $project: {
      _id: 0,
      id_profile: 0
    }
  }, { $unwind: '$profile' }
]}