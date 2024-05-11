const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

router.post("/one", chatController.getOneChat);

module.exports = router;