const path = require("path");
const fs = require("fs");
const multer = require("multer");

const uploadDir = path.join(__dirname, "public", "uploads");

const imageMimeTypes = ["image/jpeg", "image/jpg", "image/png"];
const videoMimeTypes = ["video/mp4", "video/mpeg", "video/quicktime"];
const documentMimeTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, "file_" + Date.now() + "." + file.mimetype.split("/").at(-1));
  },
});

const fileFilter = (req, file, cb) => {
  if (
    imageMimeTypes.includes(file.mimetype) ||
    videoMimeTypes.includes(file.mimetype) ||
    documentMimeTypes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});
module.exports = { upload, uploadDir };
