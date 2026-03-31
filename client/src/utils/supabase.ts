import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://bghbxjsvfnixmxwjqdau.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'sb_publishable_4jaHHJpHllrcCSAZgT-Bxg_RcjuLHrS';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
