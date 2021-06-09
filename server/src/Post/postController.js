const Post = require("./Post");
const Comment = require("../Comment/Comment")
const Like = require("../Like/Like")
const mongoose = require('mongoose')

const handleErrors = (err) => {
  let errors = {
    caption: "",
    author: "",
    category: "",
    image: "",
    like: "",
  };

  // Validation errors
  if (
    err.message.includes("post validation failed") ||
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

// Retrieving all posts
module.exports.all = async (req, res) => {
  try {
    const post = await Post.find({}, exclude);
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

// Create a post
module.exports.create = async (req, res) => {
  console.log(req.body);
  try {
    const post = await Post.create({
      author: req.body.author,
      caption: req.body.caption,
      category: req.body.category,
      image: req.file ? `${process.env.BASE_URL}/${req.file.path}` : null,
    });

    res.status(201).json({
      success: true,
      data: { post },
    });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({
      success: false,
      errors,
    });
  }
};

// Retrieve a single post
module.exports.get_post = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id, exclude);
    console.log(post.likes[0]);
    if (!post) throw Error("Not found");

    res.status(200).json({
      success: true,
      data: { post },
    });
  } catch (error) {
    if (error.kind === "ObjectId" || error.message === "Not found") {
      res.status(404).json({
        success: false,
        errors: { message: "post not found" },
      });
    } else {
      res.status(500).json({
        success: false,
        errors: { message: error.message },
      });
    }
  }
};

module.exports.remove_like = async (req, res) => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.postid)) {
      Post.findById(req.params.postid, async (err, result) => {
        if (err) {
          console.log(err);
        } else {
          if (!result) throw Error("Not found")
          const like = await Like.findOne({ liked_by: req.decodedToken.userId, liked_post: req.params.postid });
          if (like) {
            if (result.likes.includes(like._id)) {
              Post.findOneAndUpdate(
                req.params.postid,
                { $pull: { likes: like._id } },
                { new: true }
              ).exec();

              like.remove();

              res.status(202).json({
                success: true,
                data: { message: "Like Removed" },
              })
            }
          }
          else {
            res.status(400).json({
              success: false,
              errors: { message: "Like not found" },
            })
          }

        }
      })
    } else {
      res.status(400).json({
        success: false,
        errors: { message: "Post not found" },
      });
    }
  } catch (error) {
    if (error.kind === "ObjectId" || error.message === "Not found") {
      res.status(400).json({
        success: false,
        errors,
      });
    } else {
      const errors = handleErrors(error);
      res.status(400).json({
        success: false,
        errors,
      });
    }
  }
}


module.exports.remove_comment = (req, res) => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.postid)) {
      Post.findById(req.params.postid, async (err, result) => {
        if (err) {
          console.log(err);
        } else {
          if (!result) throw Error("Not found")
          if (result.comments.includes(req.params.commentid)) {
            Post.findOneAndUpdate(
              req.params.postid,
              { $pull: { comments: req.params.commentid } },
              { new: true }
            ).exec();
            const comment = await Comment.findByIdAndDelete(req.params.commentid);
            res.status(202).json({
              success: true,
              data: { message: "Comment Removed" },
            })
          } else {
            res.status(400).json({
              success: false,
              errors: { message: "Comment not found" },
            });
          }
        }
      })
    } else {
      res.status(400).json({
        success: false,
        errors: { message: "Post not found" },
      });
    }
  } catch (error) {
    if (error.kind === "ObjectId" || error.message === "Not found") {
      res.status(400).json({
        success: false,
        errors: { message: "Comment not found" },
      })
    } else {
      console.log(error);
      const errors = handleErrors(error);
      res.status(400).json({
        success: false,
        errors,
      });
    }
  }
}

// // Update a category
module.exports.update_post = async (req, res) => {
  try {
    const caption = req.body.caption;

    const post = await Post.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { caption } },
      { new: true, projection: exclude, runValidators: true }
    );

    if (!post) throw Error("Not found");

    res.status(202).json({
      success: true,
      data: { post },
    });
  } catch (error) {
    if (error.kind === "ObjectId" || error.message === "Not found") {
      res.status(404).json({
        success: false,
        errors: { message: "Category not found" },
      });
    } else if (error.message.includes("Validation failed")) {
      const errors = handleErrors(error);
      res.status(400).json({
        success: false,
        errors,
      });
    } else {
      res.status(500).json({
        success: false,
        errors: { message: error.message },
      });
    }
  }
};

// Delete post
module.exports.delete_post = async (req, res) => {
  try {
    await Like.deleteMany({ liked_post: req.params.id })
    await Comment.deleteMany({ commented_on_post: req.params.id })
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) throw Error("Not found");

    res.status(202).json({
      success: true,
      data: { message: "post deleted" },
    });
  } catch (error) {
    if (error.kind === "ObjectId" || error.message === "Not found") {
      res.status(404).json({
        success: false,
        errors: { message: "post not found" },
      });
    } else {
      res.status(500).json({
        success: false,
        errors: { message: error.message },
      });
    }
  }
};
