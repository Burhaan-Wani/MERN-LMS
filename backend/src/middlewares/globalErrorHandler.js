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

const globalErrorHandler = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";

    if (NODE_ENV === "development") {
        handleDevError(error, res);
    } else if (NODE_ENV === "production") {
        handleProdError(error, res);
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
