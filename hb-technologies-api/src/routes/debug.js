const express = require("express");

const { asyncHandler } = require("../utils/asyncHandler");
const {
  requireEmailTestToken,
  testEmail,
} = require("../controllers/debugController");

const router = express.Router();

router.get("/email-test", requireEmailTestToken, asyncHandler(testEmail));

module.exports = { debugRouter: router };
