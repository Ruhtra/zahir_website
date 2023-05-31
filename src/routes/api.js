const controllerApi = require('../controllers/api.js')
const router = require('express').Router()
const multer = require('multer')
const configMulter = require('../config/multer.js').getConfig()

const use = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
}

router.get('/profile/get', use(controllerApi.profile.get))
router.get('/profile/getList', use(controllerApi.profile.getList))

router.post('/profile/insert', multer(configMulter).single('picture'), use(controllerApi.profile.insert))
router.post('/profile/update', use(controllerApi.profile.update))
router.post('/profile/delete', use(controllerApi.profile.delete))

module.exports = router