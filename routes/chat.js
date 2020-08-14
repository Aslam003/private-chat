const express = require("express");
const router = express.Router();
const ChatId = require("../modals/ChatIds");
const Message = require("../modals/Message");
// const { updateOne } = require("../modals/Message");

// @route Post api/chat
//@desc get chat Ids
//access public

router.post("/", async (req, res) => {
  const { id } = req.body;
  try {
    let foundChat = await ChatId.find({ "users.userId": id });
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

router.post("/create", async (req, res) => {
  console.log(req.body);
  const { chatId, password, user } = req.body;
  try {
    let newChatId = await ChatId.findOne({ chatId });
    if (newChatId) return res.status(403).json("Chat id already exists");

    newChatId = ChatId({
      user: user._id,
      chatId,
      password,
      users: { name: user.name, userId: user._id },
    });

    let newChatMessage = Message({
      chatId,
      messages: [],
    });

    await newChatId.save();
    await newChatMessage.save();
    res.json(newChatId);
  } catch (error) {
    console.log(error);
  }
});

// @route POST api/chat/enter
// @desc Enter a new user to the chat
// access private
router.post("/enter", async (req, res) => {
  const { chatId, password, user } = req.body;
  try {
    let userChatId = await ChatId.findOne({ chatId });
    if (!userChatId)
      return res.status(400).json({ errMsg: "please enter correct chatid" });
    if (!password) {
      return res.status(400).json({ errMsg: "Invalid chatId password" });
    }
    await ChatId.updateOne(
      { chatId },
      {
        $push: {
          users: {
            name: user.name,
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

// @route Post api/chat/delete
//@desc delete a chatId
//access private
router.delete("/exit", async (req, res) => {
  const { chatId, user } = req.body;
  console.log(req.body);
  try {
    let deleteChatId = await ChatId.updateOne(
      { chatId },
      { $pull: { users: { userId: user } } }
    );
    if (deleteChatId) {
      console.log(deleteChatId);
      console.log("chatId deleted");
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
