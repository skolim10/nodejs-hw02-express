const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");
const { authUser } = require("../middlewares/authorization");
const { uploadMiddleware } = require("../middlewares/upload");

router.post("/signup", authUser, userController.register);
router.post("/login", userController.login);
router.get("/logout", authUser, userController.logout);
router.get("/current", authUser, userController.current);
router.get("/verify/:verificationToken", userController.verifyUserByToken);
router.patch(
  "/:userId/subscription",
  authUser,
  userController.updateSubscription
);
router.patch(
  "/avatars",
  authUser,
  uploadMiddleware.single("avatar"),
  userController.updateAvatar
);
router.delete("/", userController.deleteUserByMail);

module.exports = router;
