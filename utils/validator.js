const joi = require("joi");

const contactSchema = joi.object({
  name: joi.string().min(3),
  email: joi.string().email(),
  phone: joi.string().min(7),
  favorite: joi.boolean(),
});

const validator = (schema) => (body) => {
  return schema.validate(body, { abortEarly: false });
};

const contactsValidator = validator(contactSchema);

const userSchema = joi.object({
  email: joi.string().email(),
  password: joi.string(),
  subscription: joi.string().valid("starter", "pro", "business"),
});

const userValidator = validator(userSchema);

module.exports = { contactsValidator, userValidator };
