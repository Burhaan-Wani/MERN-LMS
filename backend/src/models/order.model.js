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
        paymentStatus: {
            type: String,
            required: [true, "Payment status is required"],
        },
        orderDate: {
            type: String,
            required: [true, "Order date is required"],
        },
        paymentId: { type: String, required: [true, "PaymentID is required"] },
        payerId: {
            type: String,
            required: [true, "PayerID is required"],
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
        paypalOrderId: {
            type: String,
            required: [true, "Paypal order ID is required"],
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
