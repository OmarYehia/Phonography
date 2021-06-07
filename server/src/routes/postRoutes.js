const { Router } = require("express");
const postController = require("../Post/postController");
const { requireAuth, grantAccess, canPerformAction } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require('path');
const Post = require("../Post/Post")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/post");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (mimetype && extName) {
        return cb(null, true);
    } else {
        cb(null, false);
    }
    // reject a file
    // if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    //     cb(null, true);
    // } else {
    //     cb(null, false);
    // }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter,
});

const router = Router();

router.get("/posts", requireAuth, grantAccess("readOwn", "post"), postController.all);
router.get("/posts/:id", requireAuth, grantAccess("readOwn", "post"), postController.get_post);
router.post("/posts", requireAuth, grantAccess("updateOwn", "post"), upload.single("postImage"), postController.create);
router.delete("/posts/:postid/like/:likeid", requireAuth, postController.remove_like);
router.delete("/posts/:postid/comment/:commentid", requireAuth, postController.remove_comment);
    
module.exports = router;