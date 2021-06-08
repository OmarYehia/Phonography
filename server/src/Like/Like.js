const mongoose = require("mongoose");
const User = require('../User/User');
const Post = require('../Post/Post');
const Category = require('../Category/Category');
const refIsValid = require('../middleware/refIsValid');

const { Schema } = mongoose;

const likeSchema = new mongoose.Schema({
    liked_post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: [true, "Liked post id is required"],
    },
    liked_by: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User id is required"],
    },
});

// likeSchema.post('remove', (like) => {
//     const likeId = like._id;
//     const postId = like.liked_post;
//     Post.findOneAndUpdate(
//         postId,
//         { $pull: { likes: likeId } },
//         { new: true }
//     ).exec();
//     // Post.find({ likes: { $in: [likeId] } })
//     //     .then(posts => {
//     //         console.log(posts);
//     //         Promise.all(
//     //             posts.map(post => {
//     //                 Post.findOneAndUpdate(
//     //                     post._id,
//     //                     { $pull: { likes: likeId } },
//     //                     { new: true }
//     //                 )
//     //             })
//     //         )
//     //         console.log(posts);
//     //     })
// })

likeSchema.index({ liked_post: 1, liked_by: 1 }, { unique: true });

likeSchema.path('liked_post').validate((value, respond) => {
    return refIsValid(value, respond, Post);
}, 'Invalid post.');

likeSchema.path('liked_by').validate((value, respond) => {
    return refIsValid(value, respond, User);
}, 'Invalid user.');

const Like = mongoose.model("like", likeSchema);

module.exports = Like;
