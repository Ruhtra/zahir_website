module.exports.listProfile = () => { return [
  {
    $lookup: {
      from: "categories",
      localField: "category.categories",
      foreignField: "_id",
      as: "categoryDocs",
    }
  }, {
    $project: {
      _id: 1,
      local: {
        uf: "$local.uf",
        city: "$local.city"
      },
      name: 1,
      picture: "$picture.url",
      category: {
        type: 1,
        categories: {
          $cond: {
            if: {
              $gt: [ { $size: "$categoryDocs" }, 0],
            },
            then: "$categoryDocs.name",
            else: "$$REMOVE",
          },
        },
      },
      createdAt: 1,
      promotion: 1,
    }
  }
]}
module.exports.profile = (id) => { return  [
  { $match: {_id: id} }, {
  $lookup: {
    from: "categories",
    localField: "category.categories",
    foreignField: "_id",
    as: "categoryDocs",
  },
}, {
  $project: {
    _id: 1,
    created: 1,
    name: 1,
    informations: 1,
    telephones: 1,
    local: 1,
    movie: 1,
    picture: "$picture.url",
    resume: 1,
    category: {
      type: 1,
      categories: {
        $cond: {
          if: {
            $gt: [ { $size: "$categoryDocs" }, 0],
          },
          then: "$categoryDocs.name",
          else: "$$REMOVE",
        },
      },
    },
    promotion: 1,
  },
}, { $limit: 1 }
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
module.exports.categoriesNotUsed = () => { return [
  {
    $lookup: {
      from: "profile",
      let: { id: "$_id", },
      pipeline: [
        { $match: { "category.type": "restaurante" } },
        { $unwind: "$category.categories" },
        {
          $group: {
            _id: null,
            mergedCategories: {
              $addToSet: "$category.categories",
            },
          },
        }, {
          $match: {
            $expr: { $in: ["$$id", "$mergedCategories"] }
          },
        }, {
          $project: {
            _id: 0,
          },
        },
      ], as: "profile",
    },
  }, {
    $project: {
      _id: true,
      name: true,
      profile: true,
    },
  }, { $match: { profile: [], }, },
]}