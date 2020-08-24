const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../modals/User");
const validator = require("email-validator");
const { query } = require("express");

// @route POST api/register
// @desc Refister a user
//@access Public

router.post("/", async (req, res) => {
  const {
    firstName,
    lastName,
    username,
    email,
    password,
    confirmPassword,
  } = req.body;
  const userValid = validator.validate(email);
  console.log(req.body);
  try {
    if (!firstName) {
      return res.send({
        success: false,
        errorMessage: "Please enter your First Name",
      });
    }
    if (!lastName) {
      return res.send({
        success: false,
        errorMessage: "Please enter your Last Name",
      });
    }
    if (!username) {
      return res.send({
        success: false,
        errorMessage: "Please enter username",
      });
    }
    if (!email) {
      return res.send({
        success: false,
        errorMessage: "Please enter email",
      });
    }
    if (!userValid) {
      return res.send({
        success: false,
        errorMessage: "Please enter a valid Email!",
      });
    }
    if (!password) {
      return res.send({
        success: false,
        errorMessage: "Please enter password",
      });
    }
    if (password.length < 6) {
      return res.send({
        success: false,
        errorMessage: "Password should be minimum 6 characters!",
      });
    }
    if (!confirmPassword) {
      return res.send({
        success: false,
        errorMessage: "Please confirm your password",
      });
    }
    if (password !== confirmPassword) {
      return res.send({
        success: false,
        errorMessage: "password mismatch!",
      });
    }

    let query = {
      $or: [
        { username: { $regex: username, $options: "i" } },
        { email: { $regex: email, $options: "i" } },
      ],
    };

    let user = await User.findOne(query);
    if (user) {
      if (username === user.username) {
        console.log(username);
        return res.send({
          success: false,
          errorMessage: "A user with this username already exists!",
        });
      }
      if (email === user.email) {
        console.log(email);
        return res.send({
          success: false,
          errorMessage: "A user with this email already exists!",
        });
      }
    }

    let newFirstName = firstName[0].toUpperCase() + firstName.slice(1);
    let newLastName = lastName[0].toUpperCase() + lastName.slice(1);
    const name = newFirstName + " " + newLastName;

    user = new User({
      name,
      username,
      email,
      password,
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    const payload = {
      user: {
        id: user.id,
      },
    };
    console.log(payload);
    jwt.sign(
      payload,
      config.get("jwtSecret"),
      {
        expiresIn: 360000,
      },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
        console.log(token);
      }
    );
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "server error" });
  }
});

module.exports = router;
