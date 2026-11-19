-- Migration: Account Deletion Function for App Store & Privacy Compliance
-- Allows authenticated users to permanently delete their account and associated metadata.

CREATE OR REPLACE FUNCTION public.delete_user_account()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- 1. Remove user-specific app records
  DELETE FROM public.favorites WHERE user_id = v_user_id;
  DELETE FROM public.user_settings WHERE user_id = v_user_id;
  DELETE FROM public.photo_sessions WHERE user_id = v_user_id;
  DELETE FROM public.pose_attempts WHERE user_id = v_user_id;
  DELETE FROM public.reports WHERE user_id = v_user_id;
  DELETE FROM public.profiles WHERE id = v_user_id;

  -- 2. Delete the user authentication record
  DELETE FROM auth.users WHERE id = v_user_id;

  RETURN TRUE;
END;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.delete_user_account() TO authenticated;
