const controllerApi = require('../controllers/api.js')
const router = require('express').Router()

const use = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
}

router.get('/profile/get', use(controllerApi.profile.get))
router.get('/profile/getList', use(controllerApi.profile.getList))
router.post('/profile/insert', use(controllerApi.profile.insert))
router.post('/profile/update', use(controllerApi.profile.update))
router.post('/profile/delete', use(controllerApi.profile.delete))

module.exports = router