const mongoose = require("mongoose");

const StudentCoursesSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
        },
        courses: [
            {
                courseId: String,
                title: String,
                instructorId: String,
                instructorName: String,
                dateOfPurchase: Date,
                courseImage: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);

const StudentCourses = mongoose.model("StudentCourses", StudentCoursesSchema);

module.exports = StudentCourses;
