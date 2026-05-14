const express = require("express");

const { asyncHandler } = require("../utils/asyncHandler");
const { getBlogPostBySlug, listBlogPosts } = require("../controllers/blogController");

const router = express.Router();

router.get("/", asyncHandler(listBlogPosts));
router.get("/:slug", asyncHandler(getBlogPostBySlug));

module.exports = { blogRouter: router };
