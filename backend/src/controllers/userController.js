const userService = require("../services/userService");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const userData = req.body;
    const user = await userService.login(userData);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Nieprawidłowa nazwa użytkownika lub hasło." });
    }

    // const isMatch = await bcrypt.compare(password, user.dataValues.Password);
    let isMatch;
    if (req.body.password === user.dataValues.Password) {
      isMatch = true;
    } else {
      isMatch = false;
    }

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Nieprawidłowa nazwa użytkownika lub hasło." });
    }

    // Utworzenie tokena JWT
    const payload = {
      UserID: user.UserID,
      Username: user.Username,
      Role: user.Role,
    };

    const token = jwt.sign(
      payload,
      "secret_key_for_json_token", // Klucz powinien być przechowywany w zmiennej środowiskowej
      { expiresIn: "1h" }
    );

    res.json({
      token: token,
      user: {
        UserID: user.UserID,
        Username: user.Username,
        Role: user.Role,
        Email: user.Email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const newUser = await userService.registerUser({
      username,
      password,
      email,
    });
    // Utworzenie tokena JWT
    const payload = {
      UserID: newUser.UserID,
      Username: newUser.Username,
      Role: newUser.Role,
    };

    const token = jwt.sign(payload, "secret_key_for_json_token", {
      expiresIn: "1h",
    });

    res.json({
      message: "Użytkownik został zarejestrowany.",
      token: token,
      user: {
        UserID: newUser.UserID,
        Username: newUser.Username,
        Role: newUser.Role,
        Email: newUser.Email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Nie można zarejestrować użytkownika." });
  }
};
