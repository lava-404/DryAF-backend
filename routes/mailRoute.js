const express = require('express')
const router = express.Router();
const scheduleReminders = require("../utils/scheduleMail");


const verifyToken = require("../middleware/authMiddleware");

router.post("/", scheduleReminders)
module.exports = router