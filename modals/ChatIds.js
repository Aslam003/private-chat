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
    default: 'https://image.flaticon.com/icons/svg/3035/3035671.svg',
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
