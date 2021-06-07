const mongoose = require("mongoose");
const User = require('../User/User');
const Category = require('../Category/Category');
const refIsValid = require('../middleware/refIsValid');

const { Schema } = mongoose;

const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        required: [true, "Caption is required"],
        minLength: [2, "Caption should be at least 2 characters long"],
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Author name is required"],
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'Like',
        unique: true,
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
    }],
    // meta_data: {

    // },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, "Category is required"],
    },
    competition: {
        type: Schema.Types.ObjectId,
        ref: 'Competition',
    },
    image: {
        type: String,
        required: [true, "Please select an image"],
    },
},{ timestamps: { createdAt: 'created_at' } });

postSchema.path('author').validate((value, respond) => {
    return refIsValid(value, respond, User);
}, 'Invalid author.');

postSchema.path('category').validate((value, respond) => {
    return refIsValid(value, respond, Category);
}, 'Invalid category.');

const Post = mongoose.model("post", postSchema);

module.exports = Post;
