const controllerMain = require('../controllers/main.js')
const router = require('express').Router()

const use = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
}

router.get('/', use(controllerMain.index))

module.exports = router