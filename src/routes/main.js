const controllerMain = require('../controllers/main.js')
const router = require('express').Router()

const Database = require("../functions/queryDB.js");

const use = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
}

router.get('/', use(controllerMain.index))

router.get('/profiles', (req, res) => {
    res.render('profiles.ejs')
})
router.get('/config/insert', async (req, res) => {
    let promotions = await Database.promotions.getAll()
    let categories = await Database.categories.getAll()

    res.render('config/insert.ejs', {
        categories: categories,
        promotions: promotions
    })
})
router.get('/config/profiles', (req, res) => {
    res.render('config/profiles.ejs')
})
router.get('/profile', async (req, res) => {
    res.render('profile.ejs')
})

module.exports = router