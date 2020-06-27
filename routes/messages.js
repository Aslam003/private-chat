const express = require('express');
const router = express.Router();
const Message = require('../modals/Message');

// @Route get /api/message
// @desc add message
// access public
router.get('/', async (req, res) => {
  console.log('data');
});
// @Route post /api/message/add
// @desc add message
// access public

router.post('/add', async (req, res) => {
  console.log('data');
});
module.exports = router;
