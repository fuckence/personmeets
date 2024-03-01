const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')

router.get('/profile', userController.getUserInfo)
router.post('/register', userController.createUser)
router.post('/login', userController.logUser)
router.get('/getUserName', userController.getUserName)
router.get('/users', userController.getUsers)
router.get('/users/:id', userController.getUserById)
router.put('/users/:id', userController.updateUser)
router.delete('/users/:id', userController.deleteUser)
router.put('/user/updateinf', userController.updateUserInformation)

module.exports = router