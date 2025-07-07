const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, "User name is required"],
        trim: true,
        maxlength: [1, "Username must contain atleast one character"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
        unique: true,
        select: false,
        maxlength: [6, "Password must be atleast 6 character long"],
    },
    role: {
        type: String,
        trim: true,
    },
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.comparePassword = async function (password, hashPassword) {
    return await bcrypt.compare(password, hashPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
