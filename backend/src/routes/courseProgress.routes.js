const express = require("express");
const restrictTo = require("../utils/accessTo");
const {
    getCurrentCourseProgress,
    markCurrentLectureAsViewed,
    resetCurrentCourseProgress,
} = require("../controllers/courseProgress.controller");
const isAuthenticated = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(isAuthenticated);
router.use(restrictTo("user"));

router.post("/mark-lecture-viewed", markCurrentLectureAsViewed);
router.post("/reset-progress", resetCurrentCourseProgress);
router.get("/:courseId", getCurrentCourseProgress);

module.exports = router;
