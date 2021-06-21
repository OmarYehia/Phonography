const { Router } = require("express");
const postController = require("../Post/postController");
const { requireAuth, grantAccess, canPerformAction } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const Post = require("../Post/Post");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/post");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
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

router.get("/posts", postController.all);
router.get("/posts/user/:userId", postController.user_all);
router.get("/posts/category/:categoryId", postController.category_all);
router.get("/posts/competition/:competitionId", postController.competition_all);
router.get(
  "/posts/currentUser",
  requireAuth,
  grantAccess("readOwn", "post"),
  postController.currentUser_all
);
router.get("/posts/:id", requireAuth, grantAccess("readOwn", "post"), postController.get_post);
router.post(
  "/posts",
  requireAuth,
  grantAccess("updateOwn", "post"),
  upload.single("postImage"),
  postController.create
);
router.delete("/posts/:postid/remove-like", requireAuth, postController.remove_like);
router.delete("/posts/:postid/comment/:commentid", requireAuth, postController.remove_comment);
router.delete("/posts/:id", requireAuth, postController.delete_post);
router.put("/posts/:id", requireAuth, grantAccess("updateOwn", "post"), postController.update_post);
router.put(
  "/posts/:postid/like",
  requireAuth,
  grantAccess("updateOwn", "post"),
  postController.like_post
);
router.delete("/posts/:postid/unlike", requireAuth, postController.unlike_post);

module.exports = router;
