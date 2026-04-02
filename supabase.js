import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://svaqquywnidqecbcwaqe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2YXFxdXl3bmlkcWVjYmN3YXFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NDgxNTIsImV4cCI6MjA4OTUyNDE1Mn0.dpSaYruBAUArI6OldUcbxHNm-WbicGckGh3-5eSybD4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);