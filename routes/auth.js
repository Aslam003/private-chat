const express = require("express");
const config = require("config");
const jwt = require("jsonwebtoken");
const User = require("../modals/User");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const router = express.Router();
router.use(express.json());
router.use(
  session({
    secret: config.get("sessionSecret"),
    resave: false,
    saveUninitialized: false,
  })
);
router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

//name captialize
const capitalName = (name) => {
  if (name) {
    let Name = name.split(" ");
    let newName = "";
    Name.forEach((sname) => {
      newName += sname[0].toUpperCase() + sname.slice(1) + " ";
    });
    return newName;
  }
};

//Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: config.get("googleClientId"),
      clientSecret: config.get("googleClientSecret"),
      callbackURL: "http://localhost:5000/auth/google/private-chat",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (accessToken, refreshToken, profile, done) {
      const { id, displayName, picture } = profile;
      User.findOne({ googleId: id }, (err, user) => {
        if (user) {
          console.log("old user");
          return done(err, user);
        } else if (!user) {
          console.log("newUser");
          const newUser = User({
            googleId: id,
            name: capitalName(displayName),
            profilePic: picture,
          });
          newUser.save();
          return done(err, newUser);
        }
      });
    }
  )
);

//Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: config.get("facebookClientId"),
      clientSecret: config.get("facebookClientSecret"),
      callbackURL: "http://localhost:5000/auth/facebook/private-chat",
      profileFields: ["id", "displayName", "photos", "email"],
    },
    function (accessToken, refreshToken, profileFields, done) {
      const { id, displayName, photos } = profileFields;
      User.findOne({ facebookId: id }, (err, user) => {
        if (user) {
          console.log("user");
          return done(err, user);
        } else if (!user) {
          console.log("new user");

          const newUser = User({
            facebookId: id,
            name: capitalName(displayName),
            profilePic: photos[0].value,
          });
          newUser.save();
          return done(err, newUser);
        }
      });
    }
  )
);
//Twitter Strategy
passport.use(
  new TwitterStrategy(
    {
      consumerKey: config.get("twitterApiKey"),
      consumerSecret: config.get("twitterApiSecret"),
      callbackURL: "http://localhost:5000/auth/twitter/private-chat",
    },
    function (token, tokenSecret, profile, done) {
      const { id, displayName, photos } = profile;
      User.findOne({ twitterId: id }, (err, user) => {
        if (user) {
          console.log(user);
          return done(err, user);
        } else if (!user) {
          const newUser = User({
            twitterId: id,
            name: capitalName(displayName),
            profilePic: photos[0].value,
          });
          newUser.save();
          return done(err, newUser);
        }
      });
    }
  )
);

//Github Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: config.get("githubClientId"),
      clientSecret: config.get("githubClientSecret"),
      callbackURL: "http://localhost:5000/auth/github/private-chat",
    },
    function (accessToken, refreshToken, profile, done) {
      const { id, displayName, photos } = profile;
      User.findOne({ githubId: id }, (err, user) => {
        if (user) {
          console.log(user);
          return done(err, user);
        } else if (!user) {
          const newUser = User({
            githubId: id,
            name: capitalName(displayName),
            profilePic: photos[0].value,
          });
          newUser.save();
          return done(err, newUser);
        }
      });
    }
  )
);

// @Route /api/auth/google
// @desc google oauth authentication
// access public
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));
router.get(
  "/google/private-chat",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
  }),
  async (req, res) => {
    try {
      const payload = {
        user: {
          id: req.user._id,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.redirect(`http://localhost:3000/?token= ${token}`);
        }
      );
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ errMsg: "server error" });
    }
  }
);

// @Route /api/auth/facebook
// @desc facebook oauth authentication
// access public
router.get("/facebook", passport.authenticate("facebook"));

router.get(
  "/facebook/private-chat",
  passport.authenticate("facebook", {
    failureRedirect: "http://localhost:3000/login",
  }),
  async (req, res) => {
    try {
      const payload = {
        user: {
          id: req.user._id,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.redirect(`http://localhost:3000/?token= ${token}`);
        }
      );
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ errMsg: "server error" });
    }
  }
);

// @Route /api/auth/twitter
// @desc twitter oauth authentication
// access public
router.get("/twitter", passport.authenticate("twitter"));

router.get(
  "/twitter/private-chat",
  passport.authenticate("twitter", { failureRedirect: "/login" }),
  async (req, res) => {
    try {
      const payload = {
        user: {
          id: req.user._id,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.redirect(`http://localhost:3000/?token= ${token}`);
        }
      );
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ errMsg: "server error" });
    }
  }
);

// @Route /api/auth/github
// @desc github oauth authentication
// access public
router.get("/github", passport.authenticate("github"));

router.get(
  "/github/private-chat",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    try {
      const payload = {
        user: {
          id: req.user._id,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.redirect(`http://localhost:3000/?token= ${token}`);
        }
      );
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ errMsg: "server error" });
    }
  }
);
module.exports = router;
