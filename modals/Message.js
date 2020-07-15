const mongoose = require("mongoose");
const MessageSchema = mongoose.Schema({
  chatId: {
    type: String,
    required: true,
  },
  messages: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      name: {
        type: String,
      },
      message: {
        type: String,
      },
      date: {
        type: Date,
      },
    },
  ],
});

module.exports = mongoose.model("messages", MessageSchema);
