const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const ChatId = require('../modals/ChatIds');

// @route Post api/chat
//@desc get chat Ids
//access public

router.post('/', async (req, res) => {
  const { id } = req.body;
  try {
    let foundChat = await ChatId.find({ 'users.userId': id });
    if (foundChat) {
      return res.json(foundChat);
    }
  } catch (error) {
    console.log(error);
  }
});

// @route Post api/chat/create
//@desc create a chatId
//access private

router.post('/create', async (req, res) => {
  const { chatId, password, user } = req.body;
  try {
    let newChatId = await ChatId.findOne({ chatId });
    if (newChatId) return res.status(403).json('Chat id already exists');

    newChatId = ChatId({
      user: user._id,
      chatId,
      password,
      users: { name: user.firstName, userId: user._id },
    });

    if (password) {
      const salt = await bcrypt.genSalt(10);
      newChatId.password = await bcrypt.hash(password, salt);
    }
    await newChatId.save();
    res.json(newChatId);
  } catch (error) {
    console.log(error);
  }
});

// @route POST api/chat/enter
// @desc Enter a new user to the chat
// access private
router.post('/enter', async (req, res) => {
  const { chatId, enterPassword, user } = req.body;
  try {
    let userChatId = await ChatId.findOne({ chatId });
    if (!userChatId)
      return res.status(400).json({ errMsg: 'please enter correct chatid' });

    if (userChatId) {
      if (userChatId.password) {
        const isPassword = await bcrypt.compare(
          enterPassword,
          userChatId.password
        );
        if (!isPassword) {
          return res.status(400).json({ errMsg: 'Invalid chatId password' });
        }
      }
    }
    await ChatId.updateOne(
      { chatId },
      {
        $push: {
          users: {
            name: user.firstName,
            userId: user._id,
          },
        },
      }
    );
    return res.json(userChatId);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
