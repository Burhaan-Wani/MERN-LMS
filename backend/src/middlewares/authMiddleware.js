const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { JWT_SECRET } = require("../config");
const User = require("../models/user.model");

const isAuthenticated = catchAsync(async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return next(
            new AppError(
                "You are not logged in. Please log in to get access",
                401
            )
        );
    }

    const decoded = await promisify(jwt.verify)(token, JWT_SECRET);

    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
        return next(
            new AppError(
                "The user belonging to this token no longer exists.",
                404
            )
        );
    }
    req.user = currentUser;
    next();
});

module.exports = isAuthenticated;
