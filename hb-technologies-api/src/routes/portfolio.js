const express = require("express");

const { asyncHandler } = require("../utils/asyncHandler");
const { listPortfolio } = require("../controllers/portfolioController");

const router = express.Router();

router.get("/", asyncHandler(listPortfolio));

module.exports = { portfolioRouter: router };
