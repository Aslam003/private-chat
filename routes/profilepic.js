const express = require("express");
const router = express.Router();
const User = require("../modals/User");
const ChatId = require("../modals/ChatIds");
// @route Post api/profilepic/user
//@desc get profile pic
//access public

router.post("/user", async (req, res) => {
  const { id, filename } = req.body;
  console.log(filename);
  let profilePic = `http://localhost:5000/upload/file/${filename}`;
  User.updateOne({ _id: id }, { $set: { profilePic } }, (err, updated) => {
    if (updated) {
      console.log(updated);
    }
  });

  res.json(req.body);
});
module.exports = router;

// @route Post api/profilepic/chat
//@desc get profile pic of chat
//access public

router.post("/chat", async (req, res) => {
  const { id, filename } = req.body;
  console.log(filename);
  let chatPic = `http://localhost:5000/upload/file/${filename}`;
  ChatId.updateOne({ _id: id }, { $set: { chatPic } }, (err, updated) => {
    if (updated) {
      console.log(updated);
      res.json(req.body);
    } else {
      res.json(err);
    }
  });
});
module.exports = router;
