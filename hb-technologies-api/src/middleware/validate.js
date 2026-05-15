function validate(schema) {
  return function validator(req, res, next) {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
      headers: req.headers,
    });

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return res.status(400).json({
        error: "VALIDATION_ERROR",
        errors,
        requestId: req.id,
      });
    }

    req.validated = result.data;
    return next();
  };
}

module.exports = { validate };
