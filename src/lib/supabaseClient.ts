import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://asyznmtmjrburksgxgpl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzeXpubXRtanJidXJrc2d4Z3BsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MTI1NTksImV4cCI6MjA3Mjk4ODU1OX0.jVoIt7p-qUPWiBvUgXgUBVgQEYZyuvdrz8kTwFQRpR0'

export const Supabase = createClient(supabaseUrl, supabaseAnonKey)
