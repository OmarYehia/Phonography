const { Router } = require("express");
const likeController = require("../Like/likeController");
const { requireAuth, grantAccess, canPerformAction } = require("../middleware/authMiddleware");

const router = Router();

// router.get("/posts", requireAuth, grantAccess("readOwn", "post"), likeController.all);
router.post("/like", requireAuth, likeController.create);

router.delete("/like/:id", requireAuth, likeController.remove_like);

module.exports = router;
