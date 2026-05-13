const express = require("express");
const { z } = require("zod");

const { asyncHandler } = require("../utils/asyncHandler");
const { validate } = require("../middleware/validate");
const { login } = require("../controllers/authController");

const router = express.Router();

const schema = z.object({
  body: z.object({
    email: z.string().trim().email().max(254),
    password: z.string().min(8).max(200),
  }),
});

// POST /auth
router.post("/", validate(schema), asyncHandler(login));

module.exports = { authRouter: router };
