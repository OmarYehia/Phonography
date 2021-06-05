const Category = require("./Category");

const handleErrors = (err) => {
  let errors = {
    name: "",
    image: "",
  };

  // Validation errors
  if (err.message.includes("category validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

// This is to exclude some fields from being returned in response
const exclude = { __v: 0 };

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

module.exports.create = async (req, res) => {
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
