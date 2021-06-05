const { Router } = require("express");
const postController = require("../Post/postController");
const { requireAuth, grantAccess, canPerformAction } = require("../middleware/authMiddleware");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/post");
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

router.get("/posts", requireAuth, grantAccess("readOwn", "post"),postController.all);
router.post("/posts", requireAuth, grantAccess("updateOwn", "post"),upload.single("postImage"), postController.create);

module.exports = router;
