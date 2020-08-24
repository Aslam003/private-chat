const express = require("express");
const router = express.Router();
const User = require("../modals/User");
const ChatId = require("../modals/ChatIds");

const capitalName = (name) => {
  if (name) {
    let Name = name.split(" ");
    let newName = "";

    // newName += Name[0][0].toUpperCase() + Name[0].slice(1) + " ";
    // newName += Name[1][0].toUpperCase() + Name[1].slice(1);

    Name.forEach((sname) => {
      newName += sname[0].toUpperCase() + sname.slice(1) + " ";
    });
    return newName;
  }
};

// @route Post api/profilename
//@desc change profile name
//access public

router.post("/", async (req, res) => {
  const { id, name } = req.body;

  if (!name) {
    return res.send({
      success: false,
      errorMessage: "Please enter name",
    });
  }

  if (name.length > 20) {
    return res.send({
      success: false,
      errorMessage: "Name should contain maximum of 20 characters",
    });
  }
  const newName = capitalName(name);

  try {
    let userUpdate = await User.updateOne(
      { _id: id },
      { $set: { name: newName } }
    );
    if (userUpdate) {
      let updated = await ChatId.updateOne(
        { "users.userId": id },
        { $set: { "users.$[elem].name": name } },
        { arrayFilters: [{ "elem.userId": id }], multi: true }
      );
      if (updated) {
        console.log(updated);
        let found = await User.findOne({ _id: id }).select("-password");
        if (found) {
          console.log(found);
          res.json(found);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
