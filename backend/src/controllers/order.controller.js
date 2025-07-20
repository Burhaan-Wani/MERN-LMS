const catchAsync = require("../utils/catchAsync");
const Order = require("../models/order.model");
const { ordersController } = require("../lib/paypal");
const { CheckoutPaymentIntent } = require("@paypal/paypal-server-sdk");
const { FRONTEND_URL } = require("../config");
const StudentCourses = require("../models/studentCourses.model");
const Course = require("../models/course.model");

const createOrder = catchAsync(async (req, res, next) => {
    const { coursePricing, courseTitle } = req.body;

    const collect = {
        body: {
            intent: CheckoutPaymentIntent.Capture,
            purchaseUnits: [
                {
                    amount: {
                        currencyCode: "USD",
                        value: coursePricing,
                    },
                    description: courseTitle,
                },
            ],
            applicationContext: {
                returnUrl: `${FRONTEND_URL}/return`,
                cancelUrl: `${FRONTEND_URL}/cancel`,
            },
        },
        prefer: "return=representation",
    };
    const response = await ordersController.createOrder(collect);

    res.status(201).json({
        status: "success",
        message: "Order initiated",
        orderId: response.result.id,
    });
});
const captureOrderAndFinalizeOrder = catchAsync(async (req, res, next) => {
    const { orderId: paypalOrderId, payerId, paymentId, orderData } = req.body;

    const response = await ordersController.captureOrder({
        id: paypalOrderId,
        prefer: "return=representation",
    });
    if (response.result.status === "COMPLETED") {
        let order = await Order.create({
            userId: orderData.userId,
            orderStatus: "confirmed",
            paymentMethod: orderData.paymentMethod,
            paymentStatus: "paid",
            orderDate: orderData.orderDate,
            instructorId: orderData.instructorId,
            courseId: orderData.courseId,
            coursePricing: orderData.coursePricing,
            paypalOrderId,
            paymentId,
            payerId,
        });

        const studentCourses = await StudentCourses.findOne({
            userId: order.userId,
        });
        order = await order.populate([
            { path: "courseId" },
            { path: "instructorId" },
        ]);

        if (studentCourses) {
            studentCourses.courses.push({
                courseId: order.courseId._id,
                title: order.courseId.title,
                instructorId: order.instructorId._id,
                instructorName: order.instructorId.userName,
                dateOfPurchase: order.orderDate,
                courseImage: order.courseId.image,
            });
            await studentCourses.save();
        } else {
            await StudentCourses.create({
                userId: order.userId,
                courses: [
                    {
                        courseId: order.courseId._id,
                        title: order.courseId.title,
                        instructorId: order.instructorId._id,
                        instructorName: order.instructorId.userName,
                        dateOfPurchase: order.orderDate,
                        courseImage: order.courseId.image,
                    },
                ],
            });
        }

        await Course.findByIdAndUpdate(order.courseId, {
            $addToSet: { students: order.userId },
        });

        return res.status(200).json({
            status: "success",
            message: "Order confirmed",
            data: { order },
        });
    }

    // Payment was not completed — don't store in DB
    return res.status(400).json({
        status: "error",
        message: "Something went wrong while processing payment",
    });
});

module.exports = {
    createOrder,
    captureOrderAndFinalizeOrder,
};
