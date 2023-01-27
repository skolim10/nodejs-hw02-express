const express = require("express");
const router = express.Router();
const { contactValidator } = require("./../../utils/validator.js");
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
  const { error } = contactValidator(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  const contact = await addContact(req.body);
  if (contact) {
    res.status(200).json(contact);
  } else {
    res.status(400).json({ message: "missing required name field" });
  }
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;

  const contactToRemove = await removeContact(contactId);

  if (contactToRemove) {
    res.status(200).json({ message: "contact deleted" });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

router.put("/:contactId", async (req, res, next) => {
  const { error } = contactValidator(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  const { name, email, phone } = req.body;
  const { contactId } = req.params;
  if (!name && !email && !phone) {
    res.status(400).json({ message: "missing fields" });
  }
  const contact = await updateContact(contactId, req.body);
  if (contact) {
    res.status(200).json(contact);
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

module.exports = router;
