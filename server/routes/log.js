const express = require('express');
const { getLogs } = require('../controllers/logController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, getLogs);

module.exports = router;
