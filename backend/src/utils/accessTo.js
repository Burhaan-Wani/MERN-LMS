const AppError = require("./AppError");

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(
                    "You do not have permisssion to perform this action",
                    403
                )
            );
        }
        next();
    };
};

module.exports = restrictTo;
