const { Router } = require("express");
const categoryController = require("../Category/categoryController");
const { requireAuth, grantAccess } = require("../middleware/authMiddleware");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/category");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter,
});

const router = Router();

// Get Categories
router.get("/categories", categoryController.all);

// Create category
router.post(
  "/categories",
  requireAuth,
  grantAccess("updateAny", "category"),
  upload.single("categoryImage"),
  categoryController.create
);

// Get Category
router.get("/categories/:id", categoryController.get_category);

// Update Category

// Delete category

module.exports = router;
