const Contact = require("./schemas/contacts");

const getAllContacts = async () => Contact.find();

const getContactById = async (contactId) => Contact.findById(contactId);

const getContactsByQbe = async (qbe) => Contact.find(qbe);

const createContact = async ({ name, email, phone, favorite }) => {
  return Contact.create({ name, email, phone, favorite });
};

const updateContact = async (contactId, fields) => {
  return Contact.findByIdAndUpdate(contactId, fields, {
    new: true,
    strict: "throw",
    runValidators: true,
  });
};

const updateStatusContact = async (contactId, favorite) => {
  return Contact.findByIdAndUpdate(contactId, { favorite });
};

const deleteContact = async (contactId) => Contact.findByIdAndRemove(contactId);

module.exports = {
  getAllContacts,
  getContactById,
  getContactsByQbe,
  createContact,
  updateContact,
  updateStatusContact,
  deleteContact,
};
