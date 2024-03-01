const Router = require('express')
const router = new Router()
const postController = require('../controllers/postController')

router.get('/post/posts', postController.getPosts)
router.put('/post/posts/:id', postController.updatePost)
router.delete('/post/posts/:id', postController.deletePost)
router.post('/post/addpost', postController.addPost)
router.get('/post/userpost', postController.getUserPost)
router.get('/post/like/number/:id', postController.getLikes)
router.put('/post/like/:id', postController.likePost)
router.delete('/post/like/:id', postController.removeLikePost)
router.get('/post/like/exist/:id', postController.likeExist)

module.exports = router