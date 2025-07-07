const express = require("express");
const {
    register,
    login,
    logout,
    me,
} = require("../controllers/auth.controller");
const isAuthenticated = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, me);

module.exports = router;
