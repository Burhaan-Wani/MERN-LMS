const Course = require("../models/course.model");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

const addCourse = catchAsync(async (req, res, next) => {
    const body = req.body;
    const allFields = Object.keys(body).every(key => body[key] !== "");
    if (!allFields) {
        return next(new AppError("All fields are required", 400));
    }
    const newCourse = await Course.create(body);

    res.status(201).json({
        status: "success",
        message: "Course created successfully",
        data: {
            course: newCourse,
        },
    });
});

const getAllCourses = catchAsync(async (req, res, next) => {
    const courses = await Course.find({});

    res.status(200).json({
        status: "success",
        message: "All courses fetched successfully",
        data: {
            courses,
        },
    });
});

const getCourse = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    if (!id) return next(new AppError("Course ID is required", 400));

    const course = await Course.findById(id);
    if (!course) {
        return next(new AppError("Course not found", 404));
    }

    res.status(200).json({
        status: "success",
        message: "Course fetched successfully",
        data: {
            course,
        },
    });
});

const updateCourse = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const body = req.body;
    if (!id) return next(new AppError("Course ID is required", 400));

    let course = await Course.findById(id);
    if (!course) return next(new AppError("Course not found", 404));

    course = await Course.findByIdAndUpdate(id, body, {
        new: true,
    });

    res.status(200).json({
        status: "success",
        message: "Course updated successfully",
        data: {
            course,
        },
    });
});

module.exports = {
    addCourse,
    getAllCourses,
    getCourse,
    updateCourse,
};
