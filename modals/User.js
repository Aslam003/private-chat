const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    default:
      'https://as1.ftcdn.net/jpg/02/59/39/46/500_F_259394679_GGA8JJAEkukYJL9XXFH2JoC3nMguBPNH.jpg',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('user', UserSchema);
