const express = require('express');
const { interact } = require('../controllers/chatController');

const router = express.Router();

router.post('/:id/interact', interact);

module.exports = router;
