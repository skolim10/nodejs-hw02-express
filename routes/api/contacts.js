const express = require("express");
const router = express.Router();

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts.js");

router.get("/", async (req, res, next) => {
  const contacts = await listContacts();

  res.status(200).json(contacts);
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const contactById = await getContactById(contactId);

  if (contactById) {
    res.status(200).json(contactById);
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

router.post("/", async (req, res, next) => {
  const { name, email, phone } = req.body;
  const newContact = await addContact(req.body);
  if (!name || !email || !phone) {
    res.status(400).json({ message: "missing required name field" });
  } else {
    res.status(201).json(newContact);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

router.put("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

module.exports = router;
