const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");
const { authUser } = require("../middlewares/authorization");

router.post("/signup", authUser, userController.register);
router.post("/login", userController.login);
router.get("/logout", authUser, userController.logout);
router.get("/current", authUser, userController.current);
router.patch(
  "/:userId/subscription",
  authUser,
  userController.updateSubscription
);

module.exports = router;
