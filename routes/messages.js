const express = require("express");
const router = express.Router();
const Message = require("../modals/Message");

// @Route get /api/message
// @desc add message
// access public
router.post("/", async (req, res) => {
  const { chatId } = req.body;
  try {
    let chatFound = await Message.findOne({ chatId: chatId });
    if (chatFound) {
      res.json(chatFound.messages);
    } else {
      res.status(401).json({ errMsg: "no chat is loaded" });
    }
  } catch (error) {
    console.log(error);
  }
});
// @Route post /api/message/add
// @desc add message
// access public

router.post("/add", async (req, res) => {
  const { chatId, user, name, message, date } = req.body;
  try {
    let chatFound = await Message.findOne({ chatId });
    if (chatFound) {
      await Message.updateOne(
        { chatId },
        {
          $push: {
            messages: {
              user,
              name: name,
              message,
              date,
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

// @Route post /api/message/delete
// @desc delete message
// access public

router.delete("/delete", async (req, res) => {
  const { chatId, id, date } = req.body;
  console.log(req.body);
  try {
    let chatFound = await Message.updateOne(
      { chatId },
      { $pull: { messages: { date } } }
    );
    if (chatFound) {
      console.log(chatFound);
    }
  } catch (error) {
    console.log(error);
  }
});

router.delete("/clear", async (req, res) => {
  const { chatId } = req.body;
  console.log(req.body);
  try {
    let deleteChatId = await Message.updateOne(
      { chatId },
      { $set: { messages: [] } }
    );
    if (deleteChatId) {
      console.log("chatId deleted");
    }
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
