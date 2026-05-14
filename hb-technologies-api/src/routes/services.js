const express = require("express");

const { asyncHandler } = require("../utils/asyncHandler");
const { getServiceBySlug, listServices } = require("../controllers/servicesController");

const router = express.Router();

router.get("/", asyncHandler(listServices));
router.get("/:slug", asyncHandler(getServiceBySlug));

module.exports = { servicesRouter: router };
