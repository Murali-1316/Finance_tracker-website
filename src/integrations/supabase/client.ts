
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qqomyrtctokfvsfigxxu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxb215cnRjdG9rZnZzZmlneHh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3Mzg5MTAsImV4cCI6MjA2NjMxNDkxMH0.0xYByj_mBlR239ffl3_ktdztJtBqwb_MOLu3AZ0wdfU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
