const controllerMain = require('../controllers/main.js')
const router = require('express').Router()

const use = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
}

router.get('/', use(controllerMain.index))
router.get('/profile', use(controllerMain.profile))
router.get('/profiles', use(controllerMain.profiles))

// config
router.get('/config/profiles', use(controllerMain.config.profiles))
router.get('/config/homePage', use(controllerMain.config.homePage))

module.exports = router