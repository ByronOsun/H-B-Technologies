const { z } = require("zod");

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .optional()
    .default("development"),
  PORT: z.coerce.number().int().positive().optional().default(4000),
  CORS_ORIGINS: z.string().optional().default(""),
  JWT_SECRET: z.string().min(32).or(z.string().min(8)),
  JWT_EXPIRES_IN: z.string().optional().default("15m"),
  SUPABASE_URL: z.string().url().optional().or(z.literal("")),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().or(z.literal("")),
  EMAIL_HOST: z.string().optional().or(z.literal("")),
  EMAIL_PORT: z.string().optional().or(z.literal("")),
  EMAIL_USER: z.string().optional().or(z.literal("")),
  EMAIL_PASS: z.string().optional().or(z.literal("")),
});

function parseOrigins(value) {
  return String(value || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  CORS_ORIGINS: process.env.CORS_ORIGINS,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
});

module.exports = {
  env: {
    ...env,
    corsOrigins: parseOrigins(env.CORS_ORIGINS),
    isProd: env.NODE_ENV === "production",
  },
};
