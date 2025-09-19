const express = require('express');
const  authorize  = require('../controllers/authController');
const router  = express.Router();

router.post('/', authorize)

module.exports = router