const express = require("express");
const passport = require("passport");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/login", userController.login);

router.post("/register", userController.register);

module.exports = router;

// router.post(
//   "/login",
//   passport.authenticate("local", {
//     successRedirect: "/dashboard",
//     failureRedirect: "/login",
//     failureFlash: true,
//   })
// );

// router.get("/logout", function (req, res) {
//   req.logout();
//   res.redirect("/");
// });
