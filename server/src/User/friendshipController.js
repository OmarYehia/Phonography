const User = require("./User");

module.exports.follow_user = async (req, res) => {
  try {
    const currentUser = await User.findById(req.decodedToken.userId);

    if (currentUser.following.includes(req.params.id)) throw Error("User already followed");

    const followedUser = await User.findByIdAndUpdate(req.params.id, {
      $push: { followers: req.decodedToken.userId },
    });

    if (!followedUser) throw Error("Not found");

    currentUser.following.push(req.params.id);
    currentUser.save();

    res.status(201).json({ success: true, message: "User followed successfully" });
  } catch (error) {
    if (error.kind === "ObjectId" || error.message === "Not found") {
      res.status(404).json({
        success: false,
        errors: { message: "User not found" },
      });
    } else if (error.message === "User already followed") {
      res.status(400).json({
        success: false,
        errors: { message: error.message },
      });
    } else {
      res.status(500).json({
        success: false,
        errors: { message: error.message },
      });
    }
  }
};

module.exports.unfollow_user = async (req, res) => {
  try {
    const currentUser = await User.findById(req.decodedToken.userId);

    if (!currentUser.following.includes(req.params.id)) throw Error("User not followed");

    const unFollowedUser = await User.findByIdAndUpdate(req.params.id, {
      $pull: { followers: req.decodedToken.userId },
    });

    if (!unFollowedUser) throw Error("Not found");

    currentUser.following = currentUser.following.filter(
      (item) => item.toString() != req.params.id
    );
    currentUser.save();

    res.status(202).json({ success: true, message: "User unfollowed successfully" });
  } catch (error) {
    if (error.kind === "ObjectId" || error.message === "Not found") {
      res.status(404).json({
        success: false,
        errors: { message: "User not found" },
      });
    } else if (error.message === "User not followed") {
      res.status(400).json({
        success: false,
        errors: { message: error.message },
      });
    } else {
      res.status(500).json({
        success: false,
        errors: { message: error.message },
      });
    }
  }
};
