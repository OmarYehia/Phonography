const User = require("../User/User");

// This variable is to exclude some fields from being returned to the user
const exclude = {
  role: 0,
  password: 0,
  __v: 0,
};

module.exports.all = async (req, res) => {
  try {
    const users = await User.find({}, exclude).populate("following");

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
    const user = await User.findById(req.params.id);

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

module.exports.delete_user = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id });

    if (!user) throw Error("Not found");

    res.status(202).json({
      success: true,
      data: { message: "User deleted successfully" },
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

module.exports.get_admins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }, exclude);

    res.status(200).json({
      success: true,
      numberOfRecords: admins.length,
      data: { admins },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      errors: { message: error.message },
    });
  }
};

module.exports.make_admin = async (req, res) => {
  try {
    let user = await User.findOneAndUpdate({ _id: req.params.id }, { $set: { role: "admin" } });

    if (!user) throw Error("Not found");

    if (user.role !== "admin") {
      res.status(202).json({
        success: true,
        data: { message: "User is now an admin" },
      });
    } else {
      res.status(202).json({
        success: false,
        errors: { message: "User is already an admin" },
      });
    }
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

module.exports.remove_admin = async (req, res) => {
  try {
    let user = await User.findOneAndUpdate(
      { _id: req.params.id, role: "admin" },
      { $set: { role: "member" } }
    );

    if (!user) throw Error("Not found");

    res.status(202).json({
      success: true,
      data: { message: "User has been removed from admins' list" },
    });
  } catch (error) {
    if (error.kind === "ObjectId" || error.message === "Not found") {
      res.status(404).json({
        success: false,
        errors: { message: "Admin not found" },
      });
    } else {
      res.status(500).json({
        success: false,
        errors: { message: error.message },
      });
    }
  }
};
