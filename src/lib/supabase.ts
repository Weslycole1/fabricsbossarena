import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qcyjntazgmxuwwxwpzot.supabase.co'
const supabaseKey = 'sb_publishable_QkCLBSEqDBYDTxDfahn6ww_yqgN8hD4'

export const supabase = createClient(supabaseUrl, supabaseKey)