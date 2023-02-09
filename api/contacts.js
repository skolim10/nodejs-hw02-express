const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contacts");
const { authUser } = require("../middlewares/authorization");

router.get("/", authUser, contactController.getAll);
router.get("/:contactId", authUser, contactController.getById);
router.post("/", authUser, contactController.addContact);
router.put("/:contactId", authUser, contactController.updateContact);
router.patch("/:contactId/favorite", authUser, contactController.setFavorite);
router.delete("/:contactId", authUser, contactController.removeContact);

module.exports = router;
