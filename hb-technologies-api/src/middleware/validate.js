function validate(schema) {
  return function validator(req, res, next) {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
      headers: req.headers,
    });

    if (!result.success) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        issues: result.error.issues,
        requestId: req.id,
      });
    }

    req.validated = result.data;
    return next();
  };
}

module.exports = { validate };
