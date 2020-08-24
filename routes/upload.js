const express = require("express");
const router = express.Router();
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const mongoose = require("mongoose");
const config = require("config");
const Grid = require("gridfs-stream");
const mongoURI = config.get("mongoURI");

const connectDB = () => {
  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
};
let gfs;
const conn = mongoose.connection;
conn.on("error", console.error.bind(console, "connection error:"));
conn.once("open", () => {
  //Init Stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
  console.log("Database Connected");
});

//Creating storage engine
const storage = new GridFsStorage({
  url: config.get("mongoURI"),
  file: (req, file) => {
    const user = JSON.parse(req.body.user);
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return res.json({
            success: false,
            errorMessage: "Image should be less than 2MB",
          });
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          // id: mongoose.Types.ObjectId(user.id),
          filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer({ storage, limits: { fileSize: 2000 * 1024 } });

// @route Post upload
// @desc Put a Image
//access Public

router.post("/", upload.single("file"), async (req, res) => {
  res.json(req.file);
});

// @route GET /image/:filename
// @desc Display all single image

router.get("/file/:filename", (req, res) => {
  const filename = req.params.filename;
  gfs.files.findOne({ filename }, (err, file) => {
    //check image exist
    if (file) {
      //output the image using readStream
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({ success: false, errorMessage: "Not an image" });
    }
  });
});

// @route delete upload
// @desc delete a Image
//access Public

router.delete("/delete/:id", (req, res) => {
  gfs.remove({ _id: req.params.id, root: "uploads" }, (error, gridStore) => {
    if (error) {
      console.log(error);
      return res
        .status(404)
        .json({ success: false, errorMessage: "eroor upload" });
    }
  });

  gfs.remove(
    { _id: new mongoose.Types.ObjectId(req.params.id), root: "uploads" },
    (err, data) => {
      if (err) {
        console.log(err);
        return res
          .status(404)
          .json({ success: false, errorMessage: "eroor upload" });
      }
      if (data) {
        console.log("deleted");
      }
      res.json({ success: true, errorMessage: "image deleted" });
    }
  );
});

module.exports = { router, connectDB };
