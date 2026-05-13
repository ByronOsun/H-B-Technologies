const express = require("express");

const { asyncHandler } = require("../utils/asyncHandler");
const { listServices } = require("../controllers/servicesController");

const router = express.Router();

router.get("/", asyncHandler(listServices));

module.exports = { servicesRouter: router };
