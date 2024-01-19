const express = require('express');
const auth = require('../auth');

const router = express.Router();

// TEST
router.delete('/clear', auth.clearRefreshTokens);

module.exports = router;