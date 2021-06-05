const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category name is required"],
    minLength: [2, "Category name should be at least 2 characters long"],
  },
  image: {
    type: Buffer,
    contentType: String,
    required: [true, "Please select an image"],
  },
});

const Category = mongoose.model("category", categorySchema);

module.exports = Category;
