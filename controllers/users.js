const { userValidator } = require("./../utils/validator");
const service = require("../service/users");
const jwt = require("jsonwebtoken");
const User = require("../service/schemas/user");
require("dotenv").config();
const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");
const Jimp = require("jimp");
const { imageStore } = require("../middlewares/upload");
const secret = process.env.SECRET;

const register = async (req, res, next) => {
  const { error } = userValidator(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { email, password, subscription } = req.body;
  const user = await service.getUser({ email });
  if (user) {
    return res.status(409).json({
      status: "error",
      code: 409,
      message: "Email is already in use",
      data: "Conflict",
    });
  }
  try {
    const avatarURL = gravatar.url(email, {
      s: "200",
      r: "pg",
      d: "mm",
    });

    const newUser = new User({ email, password, subscription });

    newUser.setPassword(password);
    await newUser.save();
    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        message: "Registration successful",
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { error } = userValidator(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { email, password } = req.body;
  const user = await service.getUser({ email });

  if (!user || !user.validPassword(password)) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "Incorrect email or password",
      data: "Unauthorized",
    });
  }

  const payload = {
    id: user.id,
    email: user.email,
  };

  const token = jwt.sign(payload, secret, { expiresIn: "1h" });
  user.setToken(token);
  await user.save();
  res.json({
    status: "success",
    code: 200,
    data: {
      token,
    },
  });
};

const logout = async (req, res, next) => {
  try {
    const user = await service.getUser({ _id: req.user._id });
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    } else {
      user.setToken(null);
      await user.save();
      res.json({
        status: "success",
        code: 204,
        data: {
          message: "No content",
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

const current = async (req, res, next) => {
  try {
    const user = await service.getUser({ _id: req.user._id });
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    } else {
      res.json({
        status: "success",
        code: 200,
        data: {
          user,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  const { email } = req.user;
  res.json({
    status: "success",
    code: 200,
    data: {
      message: `Authorization was successful: ${email}`,
    },
  });
};

const updateSubscription = async (req, res, next) => {
  try {
    const { error } = userValidator(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });
    const { subscription } = req.body;
    const { userId } = req.params;

    if (!subscription) {
      res.status(400).json({ message: "missing field subscription" });
    }
    const user = await service.updateUserSubscription(userId, subscription);

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "There is no file" });
  }
  const { description } = req.body;
  const { path: temporaryName } = req.file;
  const fileName = path.join(imageStore, req.file.filename);

  const newUser = await service.updateUserAvatar(req.body.id, fileName);
  try {
    await fs.rename(temporaryName, fileName);
  } catch (err) {
    await fs.unlink(temporaryName);
    return next(err);
  }

  const isValid = await isCorrectResizedImage(fileName);
  if (!isValid) {
    await fs.unlink(fileName);
    return res
      .status(400)
      .json({ message: "File is not a photo or problem during resizing" });
  }

  res.json({
    description,
    fileName,
    avatarURL: newUser.avatarURL,
    message: "File uploaded correctly",
    status: 200,
  });
};

const isCorrectResizedImage = async (imagePath) =>
  new Promise((resolve) => {
    try {
      Jimp.read(imagePath, (error, image) => {
        if (error) {
          resolve(false);
        } else {
          image.resize(250, 250).write(imagePath);
          resolve(true);
        }
      });
    } catch (error) {
      resolve(false);
    }
  });

module.exports = {
  register,
  login,
  logout,
  current,
  getUsers,
  updateSubscription,
  updateAvatar,
};
