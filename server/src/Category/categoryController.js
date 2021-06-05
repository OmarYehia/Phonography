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

module.exports.all = async (req, res) => {
  try {
    const categories = await Category.find({}, { __v: 0 });
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
