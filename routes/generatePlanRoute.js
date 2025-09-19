

const express = require('express');
const { generatePlan } = require('../controllers/planController')
const verifyToken = require('../middleware/authMiddleware')

const router = express.Router();

router.post('/', verifyToken, generatePlan)

module.exports = router
