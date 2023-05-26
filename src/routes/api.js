const controllerApi = require('../controllers/api.js')
const router = require('express').Router()

const use = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
}

router.get('/profile/insert', use(controllerApi.profile.insert))

module.exports = router