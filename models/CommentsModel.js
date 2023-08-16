const {Schema, model} = require('mongoose');

const CommentsSchema = new Schema({
    comment: String,
    postId: String
},{
    timestamps: true
});

const CommentsModel = model('Comments', CommentsSchema);

module.exports = {CommentsModel, CommentsSchema};