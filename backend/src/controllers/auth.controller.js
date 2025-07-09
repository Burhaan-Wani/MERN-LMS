const jwt = require("jsonwebtoken");

const User = require("../models/user.model");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { JWT_SECRET, JWT_EXPIRES_IN, NODE_ENV } = require("../config");

const register = catchAsync(async (req, res, next) => {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
        return next(new AppError("All fields are required", 400));
    }

    const existsUser = await User.findOne({ $or: [{ userName }, { email }] });
    if (existsUser) {
        return next(new AppError("User name or email already taken"));
    }

    const user = await User.create({
        userName,
        email,
        password,
    });
    user.password = undefined;

    res.status(201).json({
        status: "success",
        message: "User registered successfully",
    });
});

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError("Email and Password is required", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password, user.password))) {
        return next(new AppError("Email or Password is incorrect", 401));
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: NODE_ENV == "production" ? "None" : "Lax",
    });

    user.password = undefined;
    res.status(200).json({
        status: "success",
        message: "User Logged In successfully",
        data: {
            user,
        },
    });
});

const logout = catchAsync(async (req, res, next) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 0,
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });
    res.statu(200).json({
        status: "success",
        message: "Logged out successfully",
    });
});

const me = catchAsync(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        status: "success",
        message: "Authenticated user",
        data: {
            user,
        },
    });
});

module.exports = {
    register,
    login,
    logout,
    me,
};
