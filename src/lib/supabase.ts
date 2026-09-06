import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://bqyorbckugziotglomxc.supabase.co';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxeW9yYmNrdWd6aW90Z2xvbXhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3MTc0OTgsImV4cCI6MjEwNDI5MzQ5OH0.GI910UYhqPY2YIxgeJ0GTUA20rPY0J_dbkCn6ZBiGN8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
