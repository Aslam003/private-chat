const express = require("express");
const router = express.Router();
const ChatId = require("../modals/ChatIds");
const Message = require("../modals/Message");
const moment = require("moment");
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
    if (!chatId) {
      return res.send({
        success: false,
        errorMessage: "Please enter ChatId",
      });
    }
    if (!password) {
      return res.send({
        success: false,
        errorMessage: "Please enter password",
      });
    }
    let chatIdFound = await ChatId.findOne({ chatId });
    if (chatIdFound) {
      return res.send({
        success: false,
        errorMessage: "Chat id already exists please try another.",
      });
    } else {
      let newChatId = ChatId({
        user: user._id,
        chatId,
        password,
        users: { name: user.name, userId: user._id },
      });

      let newChatMessage = Message({
        chatId,
        messages: [
          // {
          //   user: user._id,
          //   name: user.name,
          //   message: `${user.name} created this chat!`,
          //   date: moment().format(),
          // },
        ],
      });

      await newChatId.save();
      await newChatMessage.save();
      res.json({ success: true, chat: newChatId });
    }
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
    if (!chatId) {
      return res.send({
        success: false,
        errorMessage: "Please enter ChatId",
      });
    }
    if (!password) {
      return res.send({
        success: false,
        errorMessage: "Please enter password",
      });
    }
    let userChatId = await ChatId.findOne({ chatId });
    if (!userChatId) {
      return res.send({
        success: false,
        errorMessage: "Please enter correct chatid",
      });
    }

    if (userChatId.password !== password) {
      return res.send({
        success: false,
        errorMessage: "Please enter correct password",
      });
    } else {
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
    }
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
