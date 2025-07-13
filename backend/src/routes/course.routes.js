const express = require("express");
const {
    addCourse,
    getAllCourses,
    getCourse,
    updateCourse,
} = require("../controllers/course.controller");
const isAuthenticated = require("../middlewares/authMiddleware");
const restrictTo = require("../utils/accessTo");

const router = express.Router();

router.use(isAuthenticated);
router.use(restrictTo("instructor"));
router.route("/").post(addCourse).get(getAllCourses);
router.route("/:id").get(getCourse).patch(updateCourse);

module.exports = router;
