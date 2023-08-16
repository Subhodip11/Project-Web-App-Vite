const {Schema, model} = require('mongoose');
const { CommentsSchema } = require('./CommentsModel');

const PostSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    likes: Number,
    comments: [CommentsSchema],
    userId: {type: String, required: true}

},{
    timestamps: true
});

const PostModel = model('Posts', PostSchema);

module.exports = PostModel;