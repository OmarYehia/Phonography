const mongoose = require("mongoose");
const User = require('../User/User');
const Post = require('../Post/Post');
const Category = require('../Category/Category');
const refIsValid = require('../middleware/refIsValid');

const { Schema } = mongoose;

const commentSchema = new mongoose.Schema({
    body: {
        type: String,
        required: [true, "Comment must have a body"]
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [true, "User id is required"],
    },
    commented_on_post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: [true, "Commented on post id is required"],
    },
}, { timestamps: { createdAt: 'created_at' } });

commentSchema.path('author').validate((value, respond) => {
    return refIsValid(value, respond, User);
}, 'Invalid user.');

commentSchema.path('commented_on_post').validate((value, respond) => {
    return refIsValid(value, respond, Post);
}, 'Invalid post.');

const Comment = mongoose.model("comment", commentSchema);

module.exports = Comment;
