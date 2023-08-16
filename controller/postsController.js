const PostModel = require('../models/PostModel');
const {CommentsModel} = require('../models/CommentsModel')
const UserModel = require('../models/UserModel.js');

const getUserFromHeader = async (user) => {
    return UserModel.findOne({email: user})
}

const posts = async (req, res)=>{
    const user = await getUserFromHeader(req.user);
    if(!user) return res.status(401).json("Unauthorized attempt to access");
    // console.log(user)

    const {title, description, likes} = req.body;
    const create = PostModel.create({title, description, likes, userId: user._id})
    create
    .then(doc=>{
        res.json({_id: doc._id, title: doc.title, description: doc.description, createdAt: doc.createdAt})
    })
    .catch(err=>{
        res.json(err.message)
    })
}

const allPosts = async (req, res)=>{
    const user = await getUserFromHeader(req.user);
    if(!user) return res.status(401).json("Unauthorized attempt to access");
    // console.log(user)

    const posts = await PostModel.find({userId: user._id})
    const filterDataFromPosts = posts.map((doc) => {
        return {
            _id: doc._id,
            title: doc.title,
            desc: doc.description,
            created_at: doc.createdAt,
            comments: doc.comments,
            likes: doc.likes
        }
    })

    return res.json(filterDataFromPosts);
}

const getPost = async (req, res) => {
    const { id } = req.params
    const doc = await PostModel.findById(id)
    return res.json(doc);
}

const likePost = async (req, res) => {
    const { id } = req.params
    const doc = await PostModel.findByIdAndUpdate(id, {$inc:{likes: 1}});
    if(doc)
    return res.json("Content liked");
    else
    return res.json("Unable to like content")
}

const unLikePost = async (req, res) => {
    const { id } = req.params
    const doc = await PostModel.findById(id);
    const updateDoc = await PostModel.findByIdAndUpdate(id, {$inc:{likes: (doc.likes>0?-1:0)}});
    if(updateDoc && doc.likes>0)
    return res.json("Content unliked");
    else
    return res.json("Unable to unlike content")
}

const addComments = async (req, res) => {
    const { id } = req.params
    const { comment } = req.body

    const createComment = await CommentsModel({
        comment,
        postId: id
    })

    await createComment.save()

    const findPost = await PostModel.findById(id)
    let updateComments = findPost.comments;
    updateComments.push(createComment);
    
    const updatePost = await PostModel.findByIdAndUpdate(id, {$set: {comments: updateComments}})
    if(updatePost)
    return res.json("Comment Added");
    else
    return res.json("Failed to add comment")
}

const deletePost = async (req, res) => {
    const { id } = req.params;
    await PostModel.deleteOne({ _id: id})
    await CommentsModel.deleteMany({ postId: id })

    return res.json("Post Deleted")
}

module.exports = {posts, allPosts, getPost, likePost, unLikePost, addComments, deletePost}