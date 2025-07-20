const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const StudentCourses = require("../models/studentCourses.model");
const CourseProgress = require("../models/courseProgress.model");
const Course = require("../models/course.model");

const getCurrentCourseProgress = catchAsync(async (req, res, next) => {
    const { courseId } = req.params;

    const purchasedCourses = await StudentCourses.findOne({
        userId: req.user._id,
    });

    const coursePurchasedOrNot =
        purchasedCourses.courses.findIndex(
            course => course.courseId === courseId
        ) > -1;
    if (!coursePurchasedOrNot) {
        return next(
            new AppError("You haven't purchased this course yet.", 403)
        );
    }

    const currentCourseProgress = await CourseProgress.findOne({
        courseId,
        userId: req.user._id,
    });

    if (
        !currentCourseProgress ||
        currentCourseProgress.lecturesProgress.length === 0
    ) {
        const course = await Course.findById(courseId);
        if (!course) {
            return next(new AppError("Course not found", 404));
        }

        return res.status(200).json({
            status: "success",
            message: "No progress found. You can start watching the course",
            data: {
                courseDetails: course,
                progress: [],
                isPurchased: true,
            },
        });
    }

    const courseDetails = await Course.findById(courseId);
    res.status(200).json({
        status: "success",
        data: {
            courseDetails,
            progress: currentCourseProgress.lecturesProgress,
            completed: currentCourseProgress.completed,
            completionDate: currentCourseProgress.completionDate,
            isPurchased: true,
        },
    });
});

const markCurrentLectureAsViewed = catchAsync(async (req, res, next) => {
    const { lectureId, courseId } = req.body;

    let currentCourseProgress = await CourseProgress.findOne({
        userId: req.user._id,
        courseId,
    });

    if (!currentCourseProgress) {
        currentCourseProgress = await CourseProgress.create({
            userId: req.user._id,
            courseId,
            lecturesProgress: [
                {
                    lectureId,
                    viewed: true,
                    dateViewed: new Date(),
                },
            ],
        });
    } else {
        const lectureProgress = currentCourseProgress.lecturesProgress.find(
            lec => lec.lectureId === lectureId
        );

        if (lectureProgress) {
            lectureProgress.viewed = true;
            lectureProgress.dateViewed = new Date();
        } else {
            currentCourseProgress.lecturesProgress.push({
                lectureId,
                viewed: true,
                dateViewed: new Date(),
            });
        }
        await currentCourseProgress.save();

        const course = await Course.findById(courseId);

        if (!course) {
            return next(new AppError("Course not found", 404));
        }

        const allLecturesCompleted =
            currentCourseProgress.lecturesProgress.length ===
                course.curriculum.length &&
            currentCourseProgress.lecturesProgress.every(
                lecture => lecture.viewed
            );

        if (allLecturesCompleted) {
            currentCourseProgress.completed = true;
            currentCourseProgress.completionDate = new Date();
            await currentCourseProgress.save();
        }
        res.status(200).json({
            status: "success",
            message: "Lecture marked as viewed",
            data: {
                progress: currentCourseProgress,
            },
        });
    }
});

const resetCurrentCourseProgress = catchAsync(async (req, res, next) => {
    const { courseId } = req.body;

    const progress = await CourseProgress.findOne({
        userId: req.user._id,
        courseId,
    });

    if (!progress) {
        return next(new AppError("Progress not found", 404));
    }
    progress.lecturesProgress = [];
    progress.completed = false;
    progress.completionDate = null;

    await progress.save();
    res.status(200).json({
        status: "success",
        message: "Course has been reset",
        data: {
            progress,
        },
    });
});

module.exports = {
    getCurrentCourseProgress,
    markCurrentLectureAsViewed,
    resetCurrentCourseProgress,
};
