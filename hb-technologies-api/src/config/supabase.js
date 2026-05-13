const { createClient } = require("@supabase/supabase-js");

const { env } = require("./env");

function createSupabaseAdminClient() {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return null;

  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

const supabaseAdmin = createSupabaseAdminClient();

module.exports = { supabaseAdmin };
