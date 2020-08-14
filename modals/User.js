const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");
const userSchema = mongoose.Schema({
  name: {
    type: String,
  },
  googleId: {
    type: String,
  },
  facebookId: {
    type: String,
  },
  twitterId: {
    type: String,
  },
  githubId: {
    type: String,
  },
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  profilePic: {
    type: String,
    default: "https://image.flaticon.com/icons/svg/892/892704.svg",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
userSchema.plugin(findOrCreate);
module.exports = mongoose.model("user", userSchema);
