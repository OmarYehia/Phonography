const { Router } = require("express");
const commentController = require("../Comment/commentController");
const { requireAuth, grantAccess, canPerformAction } = require("../middleware/authMiddleware");

const router = Router();

router.get("/comment/post/:postid", requireAuth, grantAccess("readOwn", "post"), commentController.all);

router.get("/comment/:commentid", requireAuth, grantAccess("readOwn", "post"), commentController.get_comment);

router.put("/comment/:commentid", requireAuth, grantAccess("readOwn", "post"), commentController.update_comment);

router.post("/comment", requireAuth, commentController.create);

router.delete("/comment/:commentid", requireAuth, commentController.delete_comment);

module.exports = router;
