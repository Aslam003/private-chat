const express = require("express");
const config = require("config");
const webpush = require("web-push");
const router = express.Router();
router.use(express.json());
//Route Post /api/subscribe
//desc push notification manager
//access public

const publicVapidKey = config.get("publicVapidKey");
const privateVapidKey = config.get("privateVapidKey");
webpush.setVapidDetails(
  "mailto:test1.aslam@gmail.com",
  publicVapidKey,
  privateVapidKey
);

router.post("/", async (req, res) => {
  //get push object
  const subscription = req.body;
  //payload creation
  const payload = JSON.stringify({ title: "testing push notification" });

  //passing objcet to notification
  webpush.sendNotification(subscription, payload).catch(console.error());
});

module.exports = router;
