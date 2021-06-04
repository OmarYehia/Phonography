const User = require("../User/User");

// This variable is to exclude some fields from being returned to the user
const exclude = {
  role: 0,
  password: 0,
  __v: 0,
};

module.exports.all = async (req, res) => {
  try {
    const users = await User.find({}, exclude);

    res.status(200).json({
      success: true,
      numberOfRecords: users.length,
      data: { users },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      errors: { message: error.message },
    });
  }
};

module.exports.get_user = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, exclude);

    if (!user) throw Error("Not found");

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    if (error.kind === "ObjectId" || error.message === "Not found") {
      res.status(404).json({
        success: false,
        errors: { message: "User not found" },
      });
    } else {
      res.status(500).json({
        success: false,
        errors: { message: error.message },
      });
    }
  }
};

module.exports.update_user = async (req, res) => {
  if (req.params.id !== req.decodedToken.userId) {
    res.status(403).json({
      success: false,
      errors: { message: "You're not authorized to perform this action" },
    });
    return;
  }

  try {
    const { name, email, phone_number, country } = req.body;

    const user = await User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { name, email, phone_number, country } },
      { new: true, projection: exclude, runValidators: true }
    );

    if (!user) throw Error("Not found");
    res.status(202).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    if (error.kind === "ObjectId" || error.message === "Not found") {
      res.status(404).json({
        success: false,
        errors: { message: "User not found" },
      });
    } else {
      res.status(500).json({
        success: false,
        errors: { message: error.message },
      });
    }
  }
};
