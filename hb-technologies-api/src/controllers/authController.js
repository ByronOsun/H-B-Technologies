const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { env } = require("../config/env");
const { supabaseAdmin } = require("../config/supabase");

async function login(req, res) {
  const { email, password } = req.validated.body;

  if (!supabaseAdmin) {
    return res.status(503).json({
      error: "SUPABASE_NOT_CONFIGURED",
      message:
        "Supabase is not configured on the API. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
      requestId: req.id,
    });
  }

  const { data, error } = await supabaseAdmin
    .from("users")
    .select("id, email, password_hash")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    return res.status(500).json({
      error: "SUPABASE_ERROR",
      message: error.message,
      requestId: req.id,
    });
  }

  if (!data) {
    return res.status(401).json({
      error: "UNAUTHORIZED",
      message: "Invalid credentials.",
      requestId: req.id,
    });
  }

  const ok = await bcrypt.compare(password, data.password_hash);
  if (!ok) {
    return res.status(401).json({
      error: "UNAUTHORIZED",
      message: "Invalid credentials.",
      requestId: req.id,
    });
  }

  const token = jwt.sign(
    {
      sub: data.id,
      email: data.email,
      role: "user",
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );

  return res.json({ accessToken: token, tokenType: "Bearer" });
}

module.exports = { login };
