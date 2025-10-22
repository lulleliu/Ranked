import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://bobiwkiblvbejagvambv.supabase.co";
const SUPABASE_KEY = "sb_publishable_z6v5yfjllgutDFbRNha8Og_QjSiLCL4";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
