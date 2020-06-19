const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../modals/User');

// @route POST api/register
// @desc Refister a user
//@access Public

router.post('/', async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(403).json({ errMsg: 'user exists' });
    }
    user = new User({
      firstName,
      lastName,
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

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      {
        expiresIn: 360000,
      },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: 'server error' });
  }
});

module.exports = router;
