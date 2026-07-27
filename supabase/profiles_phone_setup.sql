-- ============================================================================
-- FabricsBossArena — profiles.phone column
-- Run this ONCE in the Supabase SQL editor (Dashboard > SQL Editor > New query).
-- Safe to re-run (IF NOT EXISTS).
--
-- Context: the Account page now saves first name, last name, email, and
-- phone to `profiles`, but the signup flow (src/pages/Login.tsx) never wrote
-- a `phone` column, so it may not exist yet on this project.
--
-- RLS is unaffected: supabase/admin_setup.sql already created policies that
-- let a signed-in user select/insert/update only their own profiles row
-- (auth.uid() = id). No RLS changes are needed for this migration.
-- ============================================================================

alter table public.profiles
  add column if not exists phone text;
