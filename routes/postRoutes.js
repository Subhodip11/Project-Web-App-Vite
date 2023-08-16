const postRouter = require('express').Router();
const {
    posts, allPosts, getPost, likePost, unLikePost, addComments, deletePost
} = require('../controller/postsController');
const { authenticate } = require('../controller/userController')

postRouter.post("/posts", authenticate, posts)
postRouter.get("/all_posts", authenticate, allPosts)
postRouter.get("/post/:id", authenticate, getPost)
postRouter.get("/like/:id", authenticate, likePost)
postRouter.get('/unlike/:id', authenticate, unLikePost)
postRouter.post('/comment/:id', authenticate, addComments)
postRouter.delete('/posts/:id', authenticate, deletePost)

module.exports = postRouter