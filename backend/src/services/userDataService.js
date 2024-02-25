const User = require("../models/patientModel2");

const getUserById = async (userId) => {
  return await User.findByPk(userId);
};

const createUser = async (userData) => {
  return await User.create(userData);
};

module.exports = {
  getUserById,
  createUser,
};
