import { createBrowserClient } from '@supabase/ssr';

export const createClient = () => {
  return createBrowserClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_PUBLISHABLE_KEY || ''
  );
};
