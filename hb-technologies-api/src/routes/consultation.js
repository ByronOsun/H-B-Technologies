const express = require("express");
const { z } = require("zod");

const { asyncHandler } = require("../utils/asyncHandler");
const { validate } = require("../middleware/validate");
const { consultationRateLimiter } = require("../middleware/rateLimit");
const { sanitizeMiddleware } = require("../middleware/sanitize");
const { createConsultation } = require("../controllers/consultationController");

const router = express.Router();

// Apply sanitization to all consultation requests
router.use(sanitizeMiddleware);

const noHtml = (label) =>
  z
    .string()
    .trim()
    .min(1, { message: `${label} is required` })
    .max(5000, { message: `${label} must not exceed 5000 characters` })
    .refine((v) => !/[<>]/.test(v), { message: `${label} must not include HTML.` })
    .refine((v) => !/javascript:/i.test(v), {
      message: `${label} contains invalid content`,
    });

const schema = z.object({
  body: z.object({
    name: noHtml("Name").max(120),
    email: z
      .string()
      .trim()
      .email("Invalid email address")
      .max(254, "Email must not exceed 254 characters"),
    phone: z
      .string()
      .trim()
      .max(40, "Phone must not exceed 40 characters")
      .optional()
      .default(""),
    company: z
      .string()
      .trim()
      .max(120, "Company must not exceed 120 characters")
      .optional()
      .default(""),
    service: noHtml("Service").max(120),
    message: noHtml("Message").max(2000),
    source: z
      .enum(["contact", "book-consultation"], {
        errorMap: () => ({ message: "Invalid source" }),
      })
      .optional()
      .default("contact"),
  }),
});

router.post(
  "/",
  consultationRateLimiter,
  validate(schema),
  asyncHandler(createConsultation)
);

module.exports = { consultationRouter: router };
