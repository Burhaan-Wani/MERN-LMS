const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { FRONTEND_URL } = require("./config");
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./middlewares/globalErrorHandler");

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

// ROUTER HANDLER FOR UNKNOWN ROUTES
app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

module.exports = app;
