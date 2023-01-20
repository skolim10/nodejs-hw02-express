const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath, { encoding: "utf-8" });
    const contactsList = JSON.parse(data);
    return contactsList;
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts();
    const getContact = contacts.find(({ id }) => id === contactId);
    return getContact;
  } catch (error) {
    console.log(error.message);
  }
};

const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts();
    const filteredContact = contacts.filter(({ id }) => id !== contactId);
    fs.writeFile(contactsPath, JSON.stringify(filteredContact, null, 2), {
      encoding: "utf-8",
    });
    return filteredContact;
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
};

const addContact = async (body) => {
  try {
    const contacts = await listContacts();
    const { name, email, phone } = body;
    const newContact = { id: nanoid(), name, email, phone };
    const updatedContacts = [newContact, ...contacts];
    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2), {
      encoding: "utf-8",
    });
    return newContact;
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex(({ id }) => id === contactId);

    if (index === -1) return;

    contacts[index] = { ...contacts[index], ...body };
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return contacts[index];
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
