// Read-only client for the Impact Zone NJ Supabase project.
// Uses the IZ anon key — RLS on the IZ side enforces what's readable.
// To upgrade to write access (status toggle, notes), swap in a service-role
// proxy via a Lovable edge function.
import { createClient } from "@supabase/supabase-js";

const IZ_URL = "https://qgfgemknktfupcvqdqtr.supabase.co";
const IZ_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnZmdlbWtua3RmdXBjdnFkcXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMDcwNzIsImV4cCI6MjA4MTU4MzA3Mn0.QrcBHEG22bZvMsLtNObalTdesiumrA_Qw1iQGDmwzgk";

export const impactZoneClient = createClient(IZ_URL, IZ_ANON, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export const IZ_ADMIN_URL = "https://impactzonenj.com/employee/inbox";
