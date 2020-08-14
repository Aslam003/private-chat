const express = require("express");
const router = express.Router();
const User = require("../modals/User");
const ChatId = require("../modals/ChatIds");

const capitalName = (name) => {
  if (name) {
    let Name = name.split(" ");
    let newName = "";
    Name.forEach((sname) => {
      newName += sname[0].toUpperCase() + sname.slice(1) + " ";
    });
    return newName;
  }
};

// @route Post api/profilename
//@desc change profile name
//access public

router.post("/", (req, res) => {
  const { id, name } = req.body;
  const newName = capitalName(name);
  console.log(newName);
  User.updateOne({ _id: id }, { $set: { name: newName } }, (err, updated) => {
    if (updated) {
      console.log(updated);
    }
  });

  ChatId.update(
    { "users.userId": id },
    { $set: { "users.$[elem].name": name } },
    { arrayFilters: [{ "elem.userId": id }], multi: true },
    (err, updated) => {
      if (updated) {
        console.log("update");
        console.log(updated);
      }
      if (err) {
        console.log(err);
      }
    }
  );
  res.json(req.body);
});
module.exports = router;
