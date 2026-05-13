const express = require("express");

const { asyncHandler } = require("../utils/asyncHandler");
const { listBlogPosts } = require("../controllers/blogController");

const router = express.Router();

router.get("/", asyncHandler(listBlogPosts));

module.exports = { blogRouter: router };
