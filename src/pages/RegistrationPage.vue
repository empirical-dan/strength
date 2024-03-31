<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { supabase } from 'app/supabase/supabase';
import {
  useValidateEmail,
  useValidatePassword,
} from '../composables/validators';
// import { useVuelidate } from '@vuelidate/core';
// import {
//   minLength,
//   required,
//   email,
//   sameAs,
//   helpers,
// } from '@vuelidate/validators';
// import { testPattern } from 'src/patterns';

const isRegistered = ref(false);
const displayLoggedInDialog = ref(false);
const displayInvalidDialog = ref(false);

// const passwordValidators = {
//   minLength: minLength(10),
//   containsUppercase: helpers.withMessage(
//     () => 'Password must contain Uppercase (A-Z)',
//     function (value: string): boolean {
//       // console.log(value); //value is undefined
//       return /[A-Z]/.test(value);
//     }
//   ),
//   containsLowercase: helpers.withMessage(
//     () => 'Password must contain lowercase (a-z)',
//     function (value: string): boolean {
//       // console.log(value); //value is undefined
//       return /[a-z]/.test(value);
//     }
//   ),
//   containsNumber: helpers.withMessage(
//     () => 'Password must contain number (0-9)',
//     function (value: string): boolean {
//       // console.log(value); //value is undefined
//       return /[0-9]/.test(value);
//     }
//   ),
//   containsSymbol: helpers.withMessage(
//     () => 'Password must contain symbol',
//     function (value: string): boolean {
//       // console.log(value); //value is undefined
//       return /[-#!$@£%^&*()_+|~=`{}\[\]:";'<>?,.\/ ]$/.test(value);
//     }
//   ),
// };

// Create a reactive "form" object to store the values of the form fields
// const form = reactive({
//   email: '',
//   password: '',
//   confirmPassword: '',
// });

type AccountFormState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const formState = reactive(<AccountFormState>{
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
});

// // Define validation rules for each form field using "computed"
// const rules = computed(() => {
//   return {
//     email: {
//       required, // Email is required
//       email, // Must be a valid email address
//     },
//     password: {
//       required,
//       ...passwordValidators, //here is the difference
//     },
//     confirmPassword: {
//       required, // Password confirmation is required
//       sameAs: sameAs(form.password), // Must match the value of the entered password
//     },
//   };
// });
// // Use the "useVuelidate" function to perform form validation
// const v$ = useVuelidate(rules, form);

// const errorMessagePassword = computed(() => {
//   if (!v$.value.password.$error) {
//     return '';
//   } else return v$.value.password.$errors[0].$message.toString();
// });

async function createAccount() {
  // see if user already exists
  if (await signInWithEmail()) {
    displayLoggedInDialog.value = true;
    return;
  }
  const { data, error } = await supabase.auth.signUp({
    email: formState.email,
    password: formState.password,
    options: {
      emailRedirectTo: 'http://localhost:9200/#/app',
    },
  });
  if (error) {
    console.log(data);
    console.error(error);
  } else {
    isRegistered.value = true;
    console.log(data);
  }
}

async function signInWithEmail() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: formState.email,
    password: formState.password,
  });
  if (!error) {
    console.log(data);
    return true;
  } else return false;
}

const isFormValid = computed(() => {
  if (
    useValidateEmail(formState.email).valid &&
    useValidatePassword(formState.password).valid &&
    formState.password === formState.confirmPassword
  ) {
    return true;
  } else return false;
});

// Function to handle form submission
function handleSubmit() {
  // Validate the form fields
  if (!isFormValid.value) {
    // If there are errors in the form, show an alert indicating that the form is invalid
    displayInvalidDialog.value = true;
    return;
  }
  // If the form is valid, perform some action with the form data
  createAccount();
}
</script>

<template>
  <!-- style="background: linear-gradient(#8274c5, #5a4a9f)" -->

  <q-page class="window-width row justify-center items-center bg-secondary">
    <q-form @submit.prevent="handleSubmit">
      <div class="column q-px-lg">
        <div class="row">
          <q-card rounded style="width: 300px; height: 485px">
            <q-card-section class="bg-primary">
              <h4 class="text-h5 text-white q-my-sm">Registration</h4>
            </q-card-section>
            <q-card-section>
              <q-form class="q-px-sm q-pt-sm">
                <q-input
                  square
                  clearable
                  v-model="formState.email"
                  type="email"
                  label="Email"
                  :rules="[
                    (val) =>
                      useValidateEmail(val).valid ||
                      useValidateEmail(val).errors[0],
                  ]"
                >
                  <template v-slot:prepend>
                    <q-icon name="email" />
                  </template>
                </q-input>

                <q-input
                  square
                  clearable
                  v-model="formState.password"
                  type="password"
                  label="Password"
                  :rules="[
                    (val) =>
                      useValidatePassword(val).valid ||
                      useValidatePassword(val).errors[0],
                  ]"
                >
                  <!-- 10 or more upper + lower + numeric characters -->

                  <template v-slot:prepend>
                    <q-icon name="lock" />
                  </template>
                </q-input>
                <q-input
                  square
                  clearable
                  v-model="formState.confirmPassword"
                  type="password"
                  label="Confirm Password"
                  :rules="[
                    (val) =>
                      (val && val === formState.password) ||
                      'Passwords must match',
                  ]"
                >
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
                label="Register"
              />
            </q-card-actions>
            <q-card-section class="row flex-center">
              <RouterLink to="/login" class="text-grey-6">
                Return to login</RouterLink
              >
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-form>
  </q-page>

  <q-dialog
    v-model="isRegistered"
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
          Registration submitted!
        </div>
      </q-card-section>
      <q-card>
        <q-card-section class="q-mr-sm q-ml-lg">
          <div style="font-size: 1.2em; font-weight: bold" class="q-pb-md">
            Please check your email to verify.
          </div>
          Link sent to: <em>{{ formState.email }}</em
          ><br />
          <div class="q-pt-md text-bold">Welcome to Strength Stuδi/o!</div>
        </q-card-section>
      </q-card>
      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" v-close-popup to="/" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="displayLoggedInDialog"
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
            You are already registered.
          </div>
          Email: <em>{{ formState.email }}</em
          ><br />
          <div class="q-pt-md text-bold">Welcome back to Strength Stuδi/o!</div>
        </q-card-section>
      </q-card>
      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" v-close-popup to="/" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="displayInvalidDialog"
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
          Credentials invalid!
        </div>
      </q-card-section>
      <q-card>
        <q-card-section class="q-mx-lg q-pb-none">
          <div
            style="font-size: 1.2em; font-weight: bold"
            class="q-pt-sm q-pb-xs"
          >
            Please review the requirements:
          </div>
          <div class="q-pr-md">
            <ul>
              <li>Valid email address</li>
              <li>Password with at least 10 characters</li>
              <li>
                Password must include at least:
                <ul>
                  <li>One <em>uppercase</em> character</li>
                  <li>One <em>lowercase</em> character</li>
                  <li>One <em>number</em></li>
                  <li>One <em>symbol</em></li>
                </ul>
              </li>
              <li>Passwords must match</li>
            </ul>
          </div>
        </q-card-section>
      </q-card>
      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" v-close-popup />
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

.q-dialog__backdrop.fixed-full {
  backdrop-filter: blur(3px);
}
.q-item .q-focus-helper {
  display: none;
}
</style>
