const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, "Title is required"],
    },
    videoUrl: {
        type: String,
        required: [true, "Video is required"],
    },
    public_id: {
        type: String,
        required: [true, "Public ID is required"],
    },
    freePreview: {
        type: Boolean,
        required: [true, "freePreview is required"],
    },
});
const courseSchema = new mongoose.Schema(
    {
        instructorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "A course must have an instructor (ID)"],
        },
        instructorName: {
            type: String,
            trim: true,
            required: [true, "Instructor name is required"],
        },
        date: {
            type: Date,
        },
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true,
        },
        level: {
            type: String,
            required: [true, "Level is required"],
            trim: true,
            enum: ["beginner", "intermediate", "advanced"],
        },
        primaryLanguage: {
            type: String,
            required: [true, "Language is required"],
            trim: true,
        },
        subtitle: {
            type: String,
            required: [true, "Subtitle is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
        },
        image: {
            type: String,
            required: [true, "Image is required"],
            trim: true,
        },
        welcomeMessage: {
            type: String,
            required: [true, "Welcome message is required"],
            trim: true,
        },
        pricing: {
            type: String,
            required: [true, "Price is required"],
            trim: true,
        },
        objectives: {
            type: String,
            required: [true, "Objective is required"],
            trim: true,
        },
        students: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
            ],
        },
        curriculum: [
            {
                type: lectureSchema,
            },
        ],
        isPublished: Boolean,
    },
    {
        timestamps: true,
    }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
