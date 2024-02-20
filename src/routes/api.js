const controllerApi = require('../controllers/api.js')
const controllerAuth = require('../controllers/auth.js')
const upload = require("../middleware/upload.js");
const multer = require("multer")
const router = require('express').Router()

const use = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
}

router.get('/profile/get', use(controllerApi.profile.get))
router.get('/profile/getList', use(controllerApi.profile.getList))
router.get('/profile/getRecents', use(controllerApi.profile.getRecents))

router.post('/profile/insert', multer(upload.getConfig).single('file'), use(controllerApi.profile.insert))
router.post('/profile/update', multer(upload.getConfig).single('file'), use(controllerApi.profile.update))
router.post('/profile/delete', use(controllerApi.profile.delete))

router.get('/homePage/getAll', use(controllerApi.homePage.getAll))
router.post('/homePage/insert', use(controllerApi.homePage.insert))
router.post('/homePage/delete', use(controllerApi.homePage.delete))

router.get('/categories/getAll', use(controllerApi.categories.getAll))
router.get('/promotions/getAll', use(controllerApi.promotions.getAll))

router.post('/auth/login', use(controllerAuth.login))
router.post('/auth/verifyJWT', use(controllerAuth.verifyJWT))

module.exports = router