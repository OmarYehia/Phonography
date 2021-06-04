const { Router } = require("express");
const userController = require("../User/userController");
const { requireAuth, grantAccess, canPerformAction } = require("../middleware/authMiddleware");

const router = Router();

router.get("/users", userController.all);
router.get("/users/:id", userController.get_user);
router.put("/users/:id", requireAuth, canPerformAction, userController.update_user);
router.delete(
  "/users/:id",
  requireAuth,
  grantAccess("updateAny", "profile"),
  userController.delete_user
);

router.get("/admins", requireAuth, grantAccess("readAny", "profile"), userController.get_admins);
// router.post(
//   "/admins/:id",
//   requireAuth,
//   grantAccess("updateAny", "profile"),
//   userController.make_admin
// );
// router.delete(
//   "/admins/:id",
//   requireAuth,
//   grantAccess("updateAny", "profile"),
//   userController.remove_dmin
// );

module.exports = router;
