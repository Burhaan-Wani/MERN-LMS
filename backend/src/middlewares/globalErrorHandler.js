const { NODE_ENV } = require("../config");

const handleDevError = (error, res) => {
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        error,
        stack: error.stack,
    });
};

const handleProdError = (error, res) => {
    if (error.isOperational) {
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message,
        });
    } else {
        console.log("ERROR: 💥", error);
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
        });
    }
};

const handleValidationError = error => {
    const message = Object.values(error?.errors)
        .map(err => err.message)
        .join(". ");
    return new AppError(message, 400);
};

const handleCastErrorDB = error => {
    const message = `Invalid ${error.path}: ${error.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = error => {
    const key = Object.keys(error.keyValue)[0];
    const value = error.keyValue[key];
    const message = `Duplicate field value: "${value}" for "${key}". Please use another one.`;
    return new AppError(message, 400);
};

const handleJWTExpiredError = () => new AppError("JWT_EXPIRED", 401);

const handleJWTError = () =>
    new AppError("Invalid token. Please log in again.", 401);

const globalErrorHandler = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";

    if (NODE_ENV === "development") {
        handleDevError(error, res);
    } else if (NODE_ENV === "production") {
        let err = { ...error };
        err.message = error.message;
        if (error.name === "ValidationError") {
            err = handleValidationError(error);
        } else if (error.name === "CastError") {
            err = handleCastErrorDB(error);
        } else if (error.code === 11000) {
            err = handleDuplicateFieldsDB(error);
        } else if (error.name === "JsonWebTokenError") {
            err = handleJWTError();
        } else if (error.name === "TokenExpiredError") {
            err = handleJWTExpiredError();
        }
        handleProdError(err, res);
    } else {
        console.log(
            "NODE_ENV not set correctly, falling back to basic error reponse"
        );
        res.status(error.statusCode || 500).json({
            status: error.status || "error",
            message: error.message || "Something went wrong",
        });
    }
};

module.exports = globalErrorHandler;
