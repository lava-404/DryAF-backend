const express = require('express');
const router = express.Router();
const { displayPlan} = require('../controllers/planController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/',verifyToken, displayPlan )

module.exports = router