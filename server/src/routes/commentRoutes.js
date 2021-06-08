const { Router } = require("express");
const commentController = require("../Comment/commentController");
const { requireAuth, grantAccess, canPerformAction } = require("../middleware/authMiddleware");

const router = Router();

// router.get("/posts", requireAuth, grantAccess("readOwn", "post"), commentController.all);
router.post("/comment", requireAuth, commentController.create);

module.exports = router;
