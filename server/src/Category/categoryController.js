const Post = require("../Post/Post");
const Category = require("./Category");

const handleErrors = (err) => {
  let errors = {
    name: "",
    image: "",
  };

  // Duplicate names
  if (err.code === 11000) {
    errors["name"] = "This category name has already been taken";
    return errors;
  }

  // Validation errors
  if (
    err.message.includes("category validation failed") ||
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

// Retrieving all categories
module.exports.all = async (req, res) => {
  try {
    const categories = await Category.find({}, exclude);
    res.status(200).json({
      success: true,
      numberOfRecords: categories.length,
      data: { categories },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      errors: { message: error.message },
    });
  }
};

// Create a category
module.exports.create = async (req, res) => {
  console.log(req.file);
  try {
    const category = await Category.create({
      name: req.body.name,
      image: req.file ? `${process.env.BASE_URL}/${req.file.path}` : null,
    });

    res.status(201).json({
      success: true,
      data: { category },
    });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({
      success: false,
      errors,
    });
  }
};

// Retrieve a single category
module.exports.get_category = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id, exclude);

    if (!category) throw Error("Not found");

    res.status(200).json({
      success: true,
      data: { category },
    });
  } catch (error) {
    if (error.kind === "ObjectId" || error.message === "Not found") {
      res.status(404).json({
        success: false,
        errors: { message: "Category not found" },
      });
    } else {
      res.status(500).json({
        success: false,
        errors: { message: error.message },
      });
    }
  }
};

// Update a category
module.exports.update_category = async (req, res) => {
  try {
    const name = req.body.name;
    const image = req.file ? `${process.env.BASE_URL}/${req.file.path}` : null;

    const category = await Category.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { name, image } },
      { new: true, projection: exclude, runValidators: true }
    );

    if (!category) throw Error("Not found");

    res.status(202).json({
      success: true,
      data: { category },
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

// Delete category
module.exports.delete_category = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) throw Error("Not found");
    const posts = await Post.deleteMany({category: category._id});
    

    res.status(202).json({
      success: true,
      data: { message: "Category deleted" },
    });
  } catch (error) {
    if (error.kind === "ObjectId" || error.message === "Not found") {
      res.status(404).json({
        success: false,
        errors: { message: "Category not found" },
      });
    } else {
      res.status(500).json({
        success: false,
        errors: { message: error.message },
      });
    }
  }
};
