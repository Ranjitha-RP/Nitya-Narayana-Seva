import { createClient, SupabaseClient } from '@supabase/supabase-js';

// User's Supabase Project Credentials
export const DEFAULT_SUPABASE_PROJECT_ID = 'wxtgijxddwelcfytnzng';
export const DEFAULT_SUPABASE_URL = 'https://wxtgijxddwelcfytnzng.supabase.co';
export const DEFAULT_SUPABASE_KEY = 'sb_publishable__DH_0--hk8W_1roTsu8nqw_MemBRoHv';

export const getSupabaseConfig = () => {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('nns_supabase_url') || '' : '';
  const url = (envUrl || storedUrl || DEFAULT_SUPABASE_URL).trim();

  const envKey = (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY || '';
  const storedKey = typeof window !== 'undefined' ? localStorage.getItem('nns_supabase_key') || '' : '';
  const key = (envKey || storedKey || DEFAULT_SUPABASE_KEY).trim();

  return { url, key, projectId: DEFAULT_SUPABASE_PROJECT_ID };
};

export const setSupabaseConfig = (url: string, key?: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('nns_supabase_url', url.trim());
    if (key) {
      localStorage.setItem('nns_supabase_key', key.trim());
    }
  }
  cachedClient = null; // reset cached instance
};

// Optional separate Supabase configuration specifically for Volunteer Accounts
export const getVolunteerSupabaseConfig = () => {
  const envUrl = (import.meta as any).env?.VITE_VOLUNTEER_SUPABASE_URL || '';
  const storedUrl =
    typeof window !== 'undefined' ? localStorage.getItem('nns_volunteer_supabase_url') || '' : '';
  const envKey = (import.meta as any).env?.VITE_VOLUNTEER_SUPABASE_PUBLISHABLE_KEY || '';
  const storedKey =
    typeof window !== 'undefined' ? localStorage.getItem('nns_volunteer_supabase_key') || '' : '';

  const main = getSupabaseConfig();
  const customUrl = (envUrl || storedUrl).trim();
  const customKey = (envKey || storedKey).trim();

  return {
    url: customUrl || main.url,
    key: customKey || main.key,
    isSeparateDb: Boolean(customUrl && customUrl !== main.url),
  };
};

export const setVolunteerSupabaseConfig = (url: string, key?: string) => {
  if (typeof window !== 'undefined') {
    if (url.trim()) {
      localStorage.setItem('nns_volunteer_supabase_url', url.trim());
    } else {
      localStorage.removeItem('nns_volunteer_supabase_url');
    }
    if (key && key.trim()) {
      localStorage.setItem('nns_volunteer_supabase_key', key.trim());
    } else if (!url.trim()) {
      localStorage.removeItem('nns_volunteer_supabase_key');
    }
  }
  cachedVolunteerClient = null;
};

let cachedClient: SupabaseClient | null = null;
let cachedVolunteerClient: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (cachedClient) return cachedClient;

  const { url, key } = getSupabaseConfig();
  if (!url || !key) return null;

  try {
    cachedClient = createClient(url, key, {
      auth: {
        persistSession: false,
      },
    });
    return cachedClient;
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    return null;
  }
};

export const getVolunteerSupabaseClient = (): SupabaseClient | null => {
  const { url, key, isSeparateDb } = getVolunteerSupabaseConfig();
  if (!isSeparateDb) {
    return getSupabaseClient();
  }
  if (cachedVolunteerClient) return cachedVolunteerClient;
  if (!url || !key) return getSupabaseClient();

  try {
    cachedVolunteerClient = createClient(url, key, {
      auth: {
        persistSession: false,
      },
    });
    return cachedVolunteerClient;
  } catch (err) {
    console.warn('Failed to initialize Volunteer Supabase client:', err);
    return getSupabaseClient();
  }
};

/**
 * Standalone SQL script ONLY for the Volunteer Accounts table (nns_volunteers).
 * Safe to run in the same Supabase project OR a separate Volunteer Supabase database.
 */
export const VOLUNTEER_SUPABASE_SQL_SCHEMA = `-- NNS Volunteer Accounts & Profile Table
CREATE TABLE IF NOT EXISTS public.nns_volunteers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT DEFAULT '',
    email TEXT NOT NULL UNIQUE,
    password TEXT DEFAULT '',
    auth_provider TEXT DEFAULT 'email',
    gender TEXT,
    city TEXT DEFAULT 'Bengaluru',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.nns_volunteers ENABLE ROW LEVEL SECURITY;

-- Public RLS Policies (idempotent with DROP IF EXISTS)
DROP POLICY IF EXISTS "Allow public read on volunteers" ON public.nns_volunteers;
CREATE POLICY "Allow public read on volunteers" ON public.nns_volunteers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on volunteers" ON public.nns_volunteers;
CREATE POLICY "Allow public insert on volunteers" ON public.nns_volunteers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on volunteers" ON public.nns_volunteers;
CREATE POLICY "Allow public update on volunteers" ON public.nns_volunteers FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete on volunteers" ON public.nns_volunteers;
CREATE POLICY "Allow public delete on volunteers" ON public.nns_volunteers FOR DELETE USING (true);
`;

/**
 * Complete SQL script for creating all NNS tables and public policies in Supabase SQL Editor.
 */
export const SUPABASE_SQL_SCHEMA = `-- 1. NNS Volunteer Requirements Table
CREATE TABLE IF NOT EXISTS public.nns_requirements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    location TEXT NOT NULL,
    male_required INTEGER DEFAULT 0,
    female_required INTEGER DEFAULT 0,
    male_registered INTEGER DEFAULT 0,
    female_registered INTEGER DEFAULT 0,
    status TEXT DEFAULT 'OPEN',
    instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. NNS Volunteer Registrations Table
CREATE TABLE IF NOT EXISTS public.nns_registrations (
    id TEXT PRIMARY KEY,
    requirement_id TEXT REFERENCES public.nns_requirements(id) ON DELETE CASCADE,
    requirement_date TEXT NOT NULL,
    requirement_title TEXT NOT NULL,
    service_timings TEXT NOT NULL,
    location TEXT NOT NULL,
    full_name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    gender TEXT NOT NULL,
    attendance_status TEXT DEFAULT 'PENDING',
    registered_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. NNS Coordinators Profile & Authentication Table
CREATE TABLE IF NOT EXISTS public.nns_coordinators (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    security_pin TEXT NOT NULL,
    role TEXT DEFAULT 'Operations Coordinator',
    location TEXT DEFAULT 'Kidwai Memorial Institute of Oncology, Bengaluru',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. NNS Volunteer Accounts & Profile Table
CREATE TABLE IF NOT EXISTS public.nns_volunteers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT DEFAULT '',
    email TEXT NOT NULL UNIQUE,
    password TEXT DEFAULT '',
    auth_provider TEXT DEFAULT 'email',
    gender TEXT,
    city TEXT DEFAULT 'Bengaluru',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.nns_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nns_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nns_coordinators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nns_volunteers ENABLE ROW LEVEL SECURITY;

-- 6. Public read/write policies with DROP IF EXISTS (idempotent, safe to rerun anytime)
DROP POLICY IF EXISTS "Allow public read on requirements" ON public.nns_requirements;
CREATE POLICY "Allow public read on requirements" ON public.nns_requirements FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on requirements" ON public.nns_requirements;
CREATE POLICY "Allow public insert on requirements" ON public.nns_requirements FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on requirements" ON public.nns_requirements;
CREATE POLICY "Allow public update on requirements" ON public.nns_requirements FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete on requirements" ON public.nns_requirements;
CREATE POLICY "Allow public delete on requirements" ON public.nns_requirements FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow public read on registrations" ON public.nns_registrations;
CREATE POLICY "Allow public read on registrations" ON public.nns_registrations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on registrations" ON public.nns_registrations;
CREATE POLICY "Allow public insert on registrations" ON public.nns_registrations FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on registrations" ON public.nns_registrations;
CREATE POLICY "Allow public update on registrations" ON public.nns_registrations FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete on registrations" ON public.nns_registrations;
CREATE POLICY "Allow public delete on registrations" ON public.nns_registrations FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow public read on coordinators" ON public.nns_coordinators;
CREATE POLICY "Allow public read on coordinators" ON public.nns_coordinators FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on coordinators" ON public.nns_coordinators;
CREATE POLICY "Allow public insert on coordinators" ON public.nns_coordinators FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on coordinators" ON public.nns_coordinators;
CREATE POLICY "Allow public update on coordinators" ON public.nns_coordinators FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete on coordinators" ON public.nns_coordinators;
CREATE POLICY "Allow public delete on coordinators" ON public.nns_coordinators FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow public read on volunteers" ON public.nns_volunteers;
CREATE POLICY "Allow public read on volunteers" ON public.nns_volunteers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on volunteers" ON public.nns_volunteers;
CREATE POLICY "Allow public insert on volunteers" ON public.nns_volunteers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on volunteers" ON public.nns_volunteers;
CREATE POLICY "Allow public update on volunteers" ON public.nns_volunteers FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete on volunteers" ON public.nns_volunteers;
CREATE POLICY "Allow public delete on volunteers" ON public.nns_volunteers FOR DELETE USING (true);
`;
