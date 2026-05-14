const express = require("express");

const { servicesRouter } = require("./services");
const { blogRouter } = require("./blog");
const { consultationRouter } = require("./consultation");
const { authRouter } = require("./auth");

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({
    ok: true,
    status: "healthy",
    requestId: req.id,
  });
});

router.use("/services", servicesRouter);
router.use("/blog", blogRouter);
router.use("/consultation", consultationRouter);
router.use("/auth", authRouter);

module.exports = { apiRouter: router };
