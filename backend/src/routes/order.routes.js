const express = require("express");
const {
    createOrder,
    captureOrderAndFinalizeOrder,
} = require("../controllers/order.controller");
const isAuthenticated = require("../middlewares/authMiddleware");
const restrictTo = require("../utils/accessTo");

const router = express.Router();

router.use(isAuthenticated);
router.use(restrictTo("user"));

router.post("/create", createOrder);
router.post("/capture", captureOrderAndFinalizeOrder);

module.exports = router;
