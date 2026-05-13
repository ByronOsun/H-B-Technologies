const express = require("express");
const { z } = require("zod");

const { asyncHandler } = require("../utils/asyncHandler");
const { validate } = require("../middleware/validate");
const { createConsultation } = require("../controllers/consultationController");

const router = express.Router();

const noHtml = (label) =>
  z
    .string()
    .trim()
    .min(1)
    .max(5000)
    .refine((v) => !/[<>]/.test(v), { message: `${label} must not include HTML.` });

const schema = z.object({
  body: z.object({
    name: noHtml("Name").max(120),
    email: z.string().trim().email().max(254),
    phone: z.string().trim().max(40).optional().default(""),
    company: z.string().trim().max(120).optional().default(""),
    service: noHtml("Service").max(120),
    message: noHtml("Message").max(2000),
    source: z.enum(["contact", "book-consultation"]).optional().default("contact"),
  }),
});

router.post("/", validate(schema), asyncHandler(createConsultation));

module.exports = { consultationRouter: router };
