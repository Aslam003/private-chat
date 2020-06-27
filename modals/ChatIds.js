const mongoose = require('mongoose');
const ChatIdSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  chatId: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  chatPic: {
    type: String,
    default:
      'https://as1.ftcdn.net/jpg/02/59/39/46/500_F_259394679_GGA8JJAEkukYJL9XXFH2JoC3nMguBPNH.jpg',
  },
  users: [
    {
      name: {
        type: String,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
    },
  ],

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('chatId', ChatIdSchema);
