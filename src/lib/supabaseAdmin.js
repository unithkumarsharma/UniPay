import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oglnushupbmxkedjfhdp.supabase.co';
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nbG51c2h1cGJteGtlZGpmaGRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU2NjYyNTIsImV4cCI6MjEwMTI0MjI1Mn0.oy4CPQ9BhaaowQBjt1WPczLGiVRRWqOVizFiRLGp0RI';

export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
