const { Router } = require("express");
const { requireAuth } = require("../middleware/authMiddleware");
const friendshipController = require("../User/friendshipController");

const router = Router();

// Creating a friendship between two people
router.post("/friendships/:id", requireAuth, friendshipController.follow_user);
router.delete("/friendships/:id", requireAuth, friendshipController.unfollow_user);

module.exports = router;
