const User = require("./schemas/user");

const getUser = async (body) => User.findOne(body);

const updateUserSubscription = async (userId, subscription) => {
  return User.findByIdAndUpdate(userId, { subscription });
};

const updateUserAvatar = async (userId, avatarURL) => {
  return User.findByIdAndUpdate(userId, { avatarURL });
};

module.exports = { getUser, updateUserSubscription, updateUserAvatar };
