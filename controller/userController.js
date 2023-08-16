const UserModel = require('../models/UserModel');
const PostModel = require('../models/PostModel');
const {CommentsModel} = require('../models/CommentsModel');
const users = require('../data/userData.js');
const jwt = require('jsonwebtoken');
const Mongoose = require('mongoose');

const seedUsers = async (req, res)=>{
    await UserModel.deleteMany({});
    await PostModel.deleteMany({});
    await CommentsModel.deleteMany({});
    await UserModel.insertMany(users);
    res.json({data: await UserModel.find({})});
}

const getAllUsers = (req, res) => {
    UserModel.find({})
    .then(docs=>res.json({data: docs}))
    .catch(err=>res.status(400).json({error: err.message}))
}

const getUser = async (req, res) => {
    const { email, password } = req.body;
    const findUserFromDB = await UserModel.findOne({email, password})
    
    if(!findUserFromDB) return res.json("User is not registered");

    const generateToken = jwt.sign(findUserFromDB.email, process.env.SECRET_TOKEN)
    // console.log(generateToken);
    
    return res.json({username: findUserFromDB.email, followers: findUserFromDB.followers, followings: findUserFromDB.followings , token: generateToken})

}

const followUser = async (req, res) => {
    //currently logged in user info
    const user = await getUserFromHeader(req.user);
    if(!user) return res.status(401).json("Unauthorized attempt to access");

    //id of the user whom the current user wants to follow
    const { id } = req.params;
    
    //check if the user is not the current user
    if(id===user._id.toString()) return res.status(400).json("Invalid requqest! You cannot follow yourself")

    //find user which is to be followed
    const userToBeFollowed = await UserModel.findById(id);

    //check if already following the user
    const check = user.followings.filter(_id=>_id===id)
    if(check) return res.json(`Already following ${userToBeFollowed.email}`)

    //increasing following of current user, by adding the id of selected user
    user.followings.push(id);
    await UserModel.findByIdAndUpdate({_id: user._id}, {$set: {followings: user.followings}});

    //increasing followers of selected user
    userToBeFollowed.followers.push(user._id);
    await UserModel.findByIdAndUpdate(id, {$set: {followers: userToBeFollowed.followers}});
    

    return res.json(`Started Following ${userToBeFollowed.email}`)
}

const unFollowUser = async (req, res) => {
    //currently logged in user info
    const user = await getUserFromHeader(req.user);
    if(!user) return res.status(401).json("Unauthorized attempt to access");

    //id of the user whom the current user wants to unfollow
    const { id } = req.params;

    //check if the user is not the current user
    if(id===user._id.toString()) return res.status(400).json("Invalid requqest! You cannot unfollow yourself")

    //find user which is to be unfollowed
    const userToBeUnFollowed = await UserModel.findById(id);

    //filtering out the id of the user whom the current user wants to unfollow
    const updateFollowingsList = user.followings.filter((_id)=>_id!==id.toString());
    // console.log(updateFollowingsList)
    await UserModel.findByIdAndUpdate({_id: user._id}, {$set: {followings: updateFollowingsList}});

    //decreasing followers of selected user
    const updateFollowersList2 = userToBeUnFollowed.followers.filter(_id=>_id!==user._id.toString());
    // console.log(updateFollowersList2)
    await UserModel.findByIdAndUpdate(id, {$set: {followers: updateFollowersList2}});
    

    return res.json(`${userToBeUnFollowed.email} unfollowed`)
}

const authenticate = (req, res, next)=>{
    const headers = req.headers['authorization'];
    
    if(headers === null || !headers) return res.status(401).json("No authorization header found");
    
    const token = headers.split(" ")[1];

    if(token === null || !token) return res.status(401).json("No token found");

    jwt.verify(token, process.env.SECRET_TOKEN, function(err, user){
        if(err) return res.status(401).json({error: err.message})

        req.user = user
        next()
    })
}

const getUserFromHeader = async (user) => {
    return UserModel.findOne({email: user})
}

module.exports = { seedUsers, getAllUsers, getUser, followUser, unFollowUser, authenticate}