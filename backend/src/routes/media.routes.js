const express = require("express");
const upload = require("../middlewares/multer");
const {
    uploadSinglefile,
    deleteSingleFile,
} = require("../controllers/media.controller");

const router = express.Router();

router.post("/upload", upload.single("file"), uploadSinglefile);
router.delete("/delete/:id", upload.single("file"), deleteSingleFile);

module.exports = router;
