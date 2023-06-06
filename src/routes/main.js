const controllerMain = require('../controllers/main.js')
const router = require('express').Router()

const Database = require("../functions/queryDB.js");

const use = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
}

router.get('/', use(controllerMain.index))

router.get('/profiles', async (req, res) => {
    let categories = await Database.categories.getAll()

    res.render('profiles.ejs', {
        categories: categories
    })
})
router.get('/config/insert', async (req, res) => {
    let promotions = await Database.promotions.getAll()
    let categories = await Database.categories.getAll()

    res.render('config/insert.ejs', {
        categories: categories,
        promotions: promotions
    })
})
router.get('/config/profiles', async (req, res) => {
    let categories = await Database.categories.getAll()

    res.render('config/profiles.ejs', {
        categories: categories
    })
})
router.get('/profile', async (req, res) => {
    res.render('profile.ejs')
})

module.exports = router