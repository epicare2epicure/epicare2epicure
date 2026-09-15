import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fvusatiieckdngchtfcv.supabase.co';
const supabaseAnonKey = 'sb_publishable_YZ_bIN4UgxwF6A3xu_2ffg_CQ8iZFMq';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
