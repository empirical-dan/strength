<script setup lang="ts">
import { supabase } from 'app/supabase/supabase';
import { reactive, ref } from 'vue';
import { testPattern } from 'src/patterns';
import { isAlreadyLoggedIn } from '../../supabase/user';

const isLoggedIn = ref(false);

// Create a reactive "form" object to store the values of the form fields
const form = reactive({
  email: '',
  password: '',
  confirmPassword: '',
});

async function signInWithEmail() {
  if (await isAlreadyLoggedIn()) {
    console.log('Signed in already.');
    return true;
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email: form.email,
    password: form.password,
  });
  if (!error) {
    console.log(data);
    return true;
  } else {
    console.error(error);
    return false;
  }
}

// Function to handle form submission
async function handleSubmit() {
  // Try to sign in
  const success = await signInWithEmail();
  if (!success) {
    // If unsuccessful
    console.log('Failed to sign in');
    return;
  }
  // If the form is valid, perform some action with the form data
  isLoggedIn.value = true;
}
</script>

<template>
  <!-- style="background: linear-gradient(#8274c5, #5a4a9f)" -->

  <q-page class="window-width row justify-center items-center bg-secondary">
    <form @submit.prevent="handleSubmit">
      <div class="column q-px-lg">
        <div class="row">
          <q-card rounded style="width: 300px; height: 400px">
            <q-card-section class="bg-primary">
              <h4 class="text-h5 text-white q-my-sm">Sign in</h4>
            </q-card-section>
            <q-card-section>
              <q-form class="q-px-sm q-pt-sm">
                <q-input
                  square
                  clearable
                  v-model="form.email"
                  type="email"
                  label="Email"
                  :rules="[testPattern.email]"
                  error-message="Please enter a valid email address"
                >
                  <template v-slot:prepend>
                    <q-icon name="email" />
                  </template>
                </q-input>

                <q-input
                  square
                  clearable
                  v-model="form.password"
                  type="password"
                  label="Password"
                >
                  <!-- 10 or more upper + lower + numeric characters -->

                  <template v-slot:prepend>
                    <q-icon name="lock" />
                  </template>
                </q-input>
              </q-form>
            </q-card-section>
            <q-card-actions class="q-px-lg q-mt-sm q-pb-none">
              <q-btn
                type="submit"
                unelevated
                size="lg"
                color="primary"
                class="full-width text-white"
                label="Login"
              />
            </q-card-actions>
            <q-card-section class="row flex-center">
              <RouterLink to="/register" class="text-grey-6">
                Register</RouterLink
              >
            </q-card-section>
          </q-card>
        </div>
      </div>
    </form>
  </q-page>

  <q-dialog
    v-model="isLoggedIn"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card>
      <q-card-section class="bg-secondary">
        <div style="font-size: 1.5em; font-weight: bold" class="q-mr-md">
          <q-avatar
            icon="sym_o_thumb_up"
            color="primary"
            text-color="white"
            class="q-mr-md"
          />
          Signed in!
        </div>
      </q-card-section>
      <q-card>
        <q-card-section class="q-mx-lg">
          <div style="font-size: 1.2em; font-weight: bold" class="q-pb-md">
            You are logged in.
          </div>
          Email: <em>{{ form.email }}</em
          ><br />
          <div class="q-pt-md text-bold">Welcome back to Strength Stuδi/o!</div>
        </q-card-section>
      </q-card>
      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" v-close-popup to="/" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style lang="scss">
.q-field--dark {
  input,
  select {
    -webkit-text-fill-color: white;
    -webkit-background-clip: text !important;
    background-clip: text !important;
  }
}

.q-field:not(.q-field--dark) {
  input,
  select {
    background-clip: text !important;
    -webkit-background-clip: text !important;
  }
}

// .q-dialog__backdrop.fixed-full {
//   backdrop-filter: blur(3px);
// }
// .q-item .q-focus-helper {
//   display: none;
// }
</style>
