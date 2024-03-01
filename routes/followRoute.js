const Router = require('express')
const router = new Router()
const followController = require('../controllers/followController')

router.get('/follows/:id1/:id2', followController.followExist)
router.post('/follows/follow/', followController.follow)
router.post('/follows/unfollow', followController.unfollow)

module.exports = router