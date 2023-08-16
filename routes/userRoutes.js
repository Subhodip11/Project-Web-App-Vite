const userRouter = require('express').Router();
const {seedUsers, getAllUsers, authenticate, followUser, unFollowUser, getUser} = require('../controller/userController');

userRouter.get('/seedUsers', seedUsers)
userRouter.get('/allUsers', getAllUsers)
userRouter.get('/user', getUser)
userRouter.get('/follow/:id', authenticate, followUser) 
userRouter.get('/unfollow/:id', authenticate, unFollowUser)

module.exports = userRouter