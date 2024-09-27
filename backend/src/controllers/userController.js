const userService = require("../services/userService");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const userData = req.body;
    const user = await userService.login(userData);
    if (!user) {
      return res.json({
        message: "Nieprawidłowa nazwa użytkownika lub hasło.",
        errorCode: 401,
      });
    }

    const password = req.body.password; // Hasło wprowadzone przez użytkownika
    const hashedPassword = user.dataValues.Password; // Zhaszowane hasło z bazy danych

    const isMatch = await bcrypt.compareSync(password, hashedPassword); // Porównanie

    if (!isMatch) {
      return res.json({
        message: "Nieprawidłowa nazwa użytkownika lub hasło.",
        errorCode: 401,
      });
    }

    // Utworzenie tokena JWT
    const payload = {
      UserID: user.UserID,
      Username: user.Username,
      Role: user.Role,
    };

    const token = jwt.sign(payload, "secret_key_for_json_token", {
      expiresIn: "1h",
    });

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
