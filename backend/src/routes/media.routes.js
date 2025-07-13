const express = require("express");
const upload = require("../middlewares/multer");
const {
    uploadSinglefile,
    deleteSingleFile,
    bulkuploadFiles,
} = require("../controllers/media.controller");

const router = express.Router();

router.post("/upload", upload.single("file"), uploadSinglefile);
router.delete("/delete/:id", upload.single("file"), deleteSingleFile);
router.post("/bulk-upload", upload.array("files", 10), bulkuploadFiles);
module.exports = router;
