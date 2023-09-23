const controllerMain = require('../controllers/main.js')
const router = require('express').Router()

const jwt = require("../middleware/jwt.js");

const use = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
}

router.get('/', jwt.verifyJWT ,use(controllerMain.index))
router.get('/profile', jwt.verifyJWT, use(controllerMain.profile))
router.get('/profiles', jwt.verifyJWT, use(controllerMain.profiles))
router.get('/loja', jwt.verifyJWT, use(controllerMain.loja))
router.get('/anuncie', jwt.verifyJWT, use(controllerMain.anuncie))

// config
router.get('/config/profiles', jwt.requiredJWT, use(controllerMain.config.profiles))
router.get('/config/homePage', jwt.requiredJWT, use(controllerMain.config.homePage))

// authenticator
router.get('/login', use(controllerMain.authenticator.login))

module.exports = router