const controllerMain = require('../controllers/main.js')
const router = require('express').Router()

const Database = require("../functions/queryDB.js");

const use = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
}

router.get('/', use(controllerMain.index))

router.get('/profiles', async (req, res) => { res.render('profiles.ejs') })

// config
router.get('/config/insert', async (req, res) => { res.render('config/insert.ejs') })
router.get('/config/profiles', async (req, res) => { res.render('config/profiles.ejs') })
router.get('/config/homePage', async (req, res) => { res.render('config/homePage.ejs') })

router.get('/profile', async (req, res) => { res.render('profile.ejs') })

module.exports = router