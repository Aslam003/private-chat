const express = require('express');
const router = express.Router();
const Message = require('../modals/Message');

// @Route get /api/message
// @desc add message
// access public
router.post('/', async (req, res) => {
  const { chatId } = req.body;
  try {
    let chatFound = await Message.findOne({ chatId: chatId });
    if (chatFound) {
      res.json(chatFound.messages);
    } else {
      res.status(401).json({ errMsg: 'no chat is loaded' });
    }
  } catch (error) {
    console.log(error);
  }
});
// @Route post /api/message/add
// @desc add message
// access public

router.post('/add', async (req, res) => {
  const { chatId, user, message } = req.body;
  console.log(req.body);

  try {
    let chatFound = await Message.findOne({ chatId });
    if (chatFound) {
      await Message.updateOne(
        { chatId },
        {
          $push: {
            messages: {
              user,
              message,
            },
          },
        }
      );
      res.json(req.body);
    }
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
