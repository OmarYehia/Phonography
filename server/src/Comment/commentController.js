const Comment = require("./Comment");
const Post = require("../Post/Post")
const handleErrors = (err) => {
    let errors = {
        author: "",
        body: "",
        commented_on_post: "",
    };

    // Validation errors
    if (
        err.message.includes("comment validation failed") ||
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

// Retrieving all comments on a post
module.exports.all = async (req, res) => {
  try {
    const comments = await Comment.find({commented_on_post : req.params.postid}, exclude);
    res.status(200).json({
      success: true,
      numberOfRecords: comments.length,
      data: { comments },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      errors: { message: error.message },
    });
  }
};

// Create a comment
module.exports.create = async (req, res) => {
    console.log(req.body);
    try {
        const comment = new Comment();
        comment.author = req.body.author_id;
        comment.commented_on_post = req.body.post_id;
        comment.body = req.body.body;
        comment.save()
            .then((result) => {
                Post.findById({ _id: comment.commented_on_post }, (err, post) => {
                    if (post) {
                        post.comments.push(comment);
                        post.save();
                        res.status(201).json({
                            success: true,
                            data: { post },
                        });
                    }
                })
            })
    } catch (error) {
        const errors = handleErrors(error);
        res.status(400).json({
            success: false,
            errors,
        });
    }
};

// Retrieve a single comment
module.exports.get_comment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentid, exclude);

        if (!comment) throw Error("Not found");

        res.status(200).json({
            success: true,
            data: { comment },
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

// // Update a category
module.exports.update_comment = async (req, res) => {
  try {
    const body = req.body.body;

    const comment = await Comment.findOneAndUpdate(
      { _id: req.params.commentid },
      { $set: { body } },
      { new: true, projection: exclude, runValidators: true }
    );

    if (!comment) throw Error("Not found");

    res.status(202).json({
      success: true,
      data: { comment },
    });
  } catch (error) {
    if (error.kind === "ObjectId" || error.message === "Not found") {
      res.status(404).json({
        success: false,
        errors: { message: "Comment not found" },
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

// Delete comment
module.exports.delete_comment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) throw Error("Not found");

    res.status(202).json({
      success: true,
      data: { message: "Comment deleted" },
    });
  } catch (error) {
    if (error.kind === "ObjectId" || error.message === "Not found") {
      res.status(404).json({
        success: false,
        errors: { message: "Comment not found" },
      });
    } else {
      res.status(500).json({
        success: false,
        errors: { message: error.message },
      });
    }
  }
};
