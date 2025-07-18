const express = require("express");
const isAuthenticated = require("../middlewares/authMiddleware");
const restrictTo = require("../utils/accessTo");
const {
    getStudentViewCourses,
    getStudentCourseDetails,
} = require("../controllers/course.controller");

const router = express.Router();

router.use(isAuthenticated);
router.use(restrictTo("user"));

router.get("/", getStudentViewCourses);
router.get("/:id", getStudentCourseDetails);

module.exports = router;
