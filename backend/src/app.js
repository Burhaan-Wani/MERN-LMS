const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { FRONTEND_URL } = require("./config");
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./middlewares/globalErrorHandler");

const authRoutes = require("./routes/auth.routes");
const mediaRoutes = require("./routes/media.routes");
const courseRoutes = require("./routes/course.routes");
const studentRoutes = require("./routes/student.routes");
const orderRoutes = require("./routes/order.routes");
const courseProgressRoutes = require("./routes/courseProgress.routes");

const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: [FRONTEND_URL],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    })
);

// ROUTES
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/media", mediaRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/progress", courseProgressRoutes);

// ROUTER HANDLER FOR UNKNOWN ROUTES
app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

module.exports = app;
