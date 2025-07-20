const mongoose = require("mongoose");

const lectureProgressSchema = new mongoose.Schema({
    lectureId: {
        type: String,
    },
    viewed: Boolean,
    dateViewed: Date,
});

const courseProgressSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: [true, "Course ID is required"],
        },
        completed: {
            type: Boolean,
            default: false,
        },
        completionDate: {
            type: Date,
        },
        lecturesProgress: [lectureProgressSchema],
    },
    {
        timestamps: true,
    }
);

const CourseProgress = mongoose.model("CourseProgress", courseProgressSchema);

module.exports = CourseProgress;
