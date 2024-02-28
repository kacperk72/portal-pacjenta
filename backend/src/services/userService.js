const User = require("../models/userModel");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

const login = async (body) => {
  try {
    const user = await User.findOne({ where: { username: body.username } });
    return user;
  } catch (error) {
    throw error;
  }
};

const registerUser = async ({ username, password, email }) => {
  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = await User.create({
    UserID: uuidv4(),
    Username: username,
    Password: hashedPassword,
    Email: email,
    Role: "patient",
  });

  return newUser;
};

module.exports = { login, registerUser };
