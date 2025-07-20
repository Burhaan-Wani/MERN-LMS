const Course = require("../models/course.model");
const StudentCourses = require("../models/studentCourses.model");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

// For Instructor
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

// For Students
const getStudentViewCourses = catchAsync(async (req, res, next) => {
    const {
        category = "",
        level = "",
        primaryLanguage = "",
        sortBy = "price-lowtohigh",
    } = req.query;

    // Parse comma-separated query params into arrays
    const parsedCategory = category ? category.split(",") : [];
    const parsedLevel = level ? level.split(",") : [];
    const parsedPrimaryLanguage = primaryLanguage
        ? primaryLanguage.split(",")
        : [];

    // Construct filters object
    const filters = {};
    if (parsedCategory.length) {
        filters.category = { $in: parsedCategory };
    }
    if (parsedLevel.length) {
        filters.level = { $in: parsedLevel };
    }
    if (parsedPrimaryLanguage.length) {
        filters.primaryLanguage = { $in: parsedPrimaryLanguage };
    }

    // Define sorting logic
    const sortMap = {
        "price-lowtohigh": { pricing: 1 },
        "price-hightolow": { pricing: -1 },
        "title-atoz": { title: 1 },
        "title-ztoa": { title: -1 },
    };

    const sortParam = sortMap[sortBy] || { pricing: 1 };

    // Fetch filtered and sorted courses
    const courses = await Course.find(filters).sort(sortParam);

    res.status(200).json({
        status: "success",
        message: "Courses fetched successfully",
        data: {
            courses,
        },
    });
});

const getStudentCourseDetails = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const courseDetails = await Course.findById(id);
    if (!courseDetails) {
        return next(new AppError("Course not found", 404));
    }

    const studentBoughtCourses = await StudentCourses.findOne({
        userId: req.user._id,
    });

    const isPurchased = studentBoughtCourses?.courses.findIndex(
        course => course.courseId === id
    );
    res.status(200).json({
        status: "success",
        messsage: "Course fetched successfully",
        data: {
            course: courseDetails,
            isPurchased: isPurchased > -1 ? id : "",
        },
    });
});

// Paid ones
const getMyCourses = catchAsync(async (req, res, next) => {
    const { userId } = req.params;
    const myPaidCourses = await StudentCourses.findOne({ userId });
    res.status(200).json({
        status: "success",
        message: "My courses",
        data: {
            courses: myPaidCourses?.courses || [],
        },
    });
});
module.exports = {
    addCourse,
    getAllCourses,
    getCourse,
    updateCourse,
    getStudentViewCourses,
    getStudentCourseDetails,
    getMyCourses,
};
