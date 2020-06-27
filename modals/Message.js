const mongoose = require('mongoose');
const MessageSchema = mongoose.Schema({
  chatId: {
    type: String,
    required: true,
  },
  messages: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
      message: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model('messages', MessageSchema);
