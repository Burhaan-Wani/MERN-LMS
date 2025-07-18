const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        orderStatus: {
            type: String,
            required: [true, "Order status is required"],
        },
        paymentMethod: {
            type: String,
            required: [true, "Payment method is required"],
        },
        orderDate: {
            type: String,
            required: [true, "Order date is required"],
        },
        paymentId: {
            type: String,
            required: [true, "Paymend ID is required"],
        },
        instructorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Instructor ID is required"],
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: [true, "Course ID is required"],
        },
        coursePricing: {
            type: String,
            required: [true, "Price is required"],
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
