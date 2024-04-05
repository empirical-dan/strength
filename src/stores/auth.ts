import { supabase } from 'src/supabase/supabase';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const userId = ref<string | null>(null);
  const isLoggedIn = ref(false);

  async function signInWithPassword(email: string, password: string) {
    if (await getSession()) {
      console.log('Signed in already.');
      return true;
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!error) {
      userId.value = data.user.id;
      isLoggedIn.value = true;
      console.log(data);
      return true;
    } else {
      userId.value = null;
      isLoggedIn.value = false;
      console.error(error);
      return false;
    }
  }

  async function getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.log('Error checking session');
      console.log(error);
      userId.value = null;
      isLoggedIn.value = false;
      return false;
    }
    if (data.session) {
      console.log('Existing user session:');
      userId.value = data.session.user.id;
      isLoggedIn.value = true;
      return true;
    } else {
      console.log('No existing session');
      userId.value = null;
      isLoggedIn.value = false;
      return false;
    }
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log('Failed to sign out');
      return false;
    } else {
      userId.value = null;
      isLoggedIn.value = false;
      console.log('Signed out');
      return true;
    }
  }

  async function signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: 'http://localhost:9200/#/app',
      },
    });
    if (error) {
      console.log(data);
      console.error(error);
      return false;
    } else {
      console.log(data);
      return true;
    }
  }

  return {
    userId,
    isLoggedIn,
    signInWithPassword,
    getSession,
    signOut,
    signUp,
  };
});
