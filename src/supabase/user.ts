import { supabase } from 'src/supabase/supabase';

export async function isAlreadyLoggedIn() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.log('Error checking session');
    console.log(error);
    return false;
  }
  if (data.session) {
    console.log('Existing user session:');
    return true;
  } else {
    console.log('No existing session');
    return false;
  }
}
