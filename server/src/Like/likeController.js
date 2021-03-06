const Like = require("./Like");
const Post = require("../Post/Post")
const handleErrors = (err) => {
    let errors = {
        liked_post: "",
        liked_by: "",
    };

    // Validation errors
    if (
        err.message.includes("like validation failed") ||
        err.message.includes("Validation failed")
    ) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
};

// This is to exclude some fields from being returned in response
const exclude = { __v: 0 };

// Retrieving all likes on this post
module.exports.all = async (req, res) => {
    try {
        const post = await Like.find({ liked_post: req.params.postid }, exclude);
        res.status(200).json({
            success: true,
            numberOfRecords: post.length,
            data: { post },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            errors: { message: error.message },
        });
    }
};

// Create a Like
module.exports.create = async (req, res) => {
    try {
        const like = new Like();
        like.liked_by = req.body.user_id;
        like.liked_post = req.body.post_id;
        like.save()
            .then((result) => {
                Post.findById({ _id: like.liked_post }, (err, post) => {
                    if (post) {
                        post.likes.push(like);
                        post.save();
                        res.status(201).json({
                            success: true,
                            data: { post },
                        });
                    }
                })
            }).catch((err) => {
                res.status(400).json({
                    success: false,
                    errors: { message: `Like on post: ${like.liked_post} already exists` },
                });
            })
    } catch (error) {
        const errors = handleErrors(error);
        res.status(400).json({
            success: false,
            errors,
        });
    }
};

// Remove Like
module.exports.remove_like = async (req, res) => {
    try {
        const like = await Like.findById(req.params.id);
        if (!like) throw Error("Not found");
        like.remove();
        res.status(202).json({
            success: true,
            data: { message: "Like Removed" },
        });
    } catch (error) {
        if (error.kind === "ObjectId" || error.message === "Not found") {
            res.status(404).json({
                success: false,
                errors: { message: "Like not found" },
            });
        } else {
            res.status(500).json({
                success: false,
                errors: { message: error.message },
            });
        }
    }
};
