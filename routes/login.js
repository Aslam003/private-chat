const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const config = require("config");
const User = require("../modals/User");

// @route Get api/login
// @desc Log a user
//access Private

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.log(err.message);
    res.status(500).json({ errMsg: "server error" });
  }
});

// @route POST api/auth
// @desc authenticate user and create token
// @access Public

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username) {
      return res.send({
        success: false,
        errorMessage: "Please enter username",
      });
    }

    if (!password) {
      return res.send({
        success: false,
        errorMessage: "Please enter password",
      });
    }
    let user = await User.findOne({ username });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, errorMessage: "Username does not exists!" });
    }

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res
        .status(400)
        .json({ success: false, errorMessage: "Incorrect password!" });
    }
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ errMsg: "server error" });
  }
});

module.exports = router;
