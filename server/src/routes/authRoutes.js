const { Router } = require("express");
const authController = require("../User/authController");

const router = Router();

router.post("/signup", authController.signup_post);
router.post("/login", authController.login_post);

module.exports = router;
