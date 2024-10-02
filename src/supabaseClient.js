import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vunlepqcjoywpimxdica.supabase.co';  // From .env
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1bmxlcHFjam95d3BpbXhkaWNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc4Njc0MDMsImV4cCI6MjA0MzQ0MzQwM30.MG7TaF7WMCd36Ni30seU25fqLDwUa1uFmCer5qysZj4';  // From .env

export const supabase = createClient(supabaseUrl, supabaseKey);
