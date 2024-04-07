<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import {
  useValidateEmail,
  useValidatePassword,
} from '../composables/validators';
import { useAuthStore } from 'src/stores/auth';

const auth = useAuthStore();
const displayIsRegisteredDialog = ref(false);
const displayLoggedInDialog = ref(false);
const displayInvalidDialog = ref(false);
const displayRegistrationFailedDialog = ref(false);
const submitting = ref(false);

type accountForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const form = reactive(<accountForm>{
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
});

async function createAccount() {
  // see if user already exists
  if (await auth.signInWithPassword(form.email, form.password)) {
    displayLoggedInDialog.value = true;
    return true;
  }
  if (await auth.signUp(form.email, form.password)) {
    displayIsRegisteredDialog.value = true;
    return true;
  } else {
    displayRegistrationFailedDialog.value = true;
    console.log('Failed to sign up');

    return false;
  }
}

const isFormValid = computed(() => {
  if (
    useValidateEmail(form.email).valid &&
    useValidatePassword(form.password).valid &&
    form.password === form.confirmPassword
  ) {
    return true;
  } else return false;
});

// Function to handle form submission
async function handleSubmit() {
  submitting.value = true;
  console.log('Form Submitted');
  // Validate the form fields
  if (!isFormValid.value) {
    // If there are errors in the form, show an alert indicating that the form is invalid
    console.log('Invalid form');
    displayInvalidDialog.value = true;
    submitting.value = false;
    return;
  }
  // If the form is valid, perform some action with the form data
  console.log('Trying to create account');
  await createAccount();
  submitting.value = false;
}
</script>

<template>
  <q-page class="window-width row justify-center items-center bg-secondary">
    <q-form>
      <div class="column q-px-lg">
        <div class="row">
          <q-card rounded style="width: 300px; height: 475px">
            <q-card-section class="bg-primary">
              <h4 class="text-h5 text-white q-my-xs">Registration</h4>
            </q-card-section>
            <q-card-section>
              <q-form class="q-px-sm q-pt-sm">
                <q-input
                  tabindex="0"
                  square
                  clearable
                  v-model="form.email"
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
                  tabindex="1"
                  square
                  clearable
                  v-model="form.password"
                  type="password"
                  label="Password"
                  :rules="[
                    (val) =>
                      useValidatePassword(val).valid ||
                      useValidatePassword(val).errors[0],
                  ]"
                >
                  <!-- 10 or more upper + lower + numeric characters + symbol -->

                  <template v-slot:prepend>
                    <q-icon name="lock" />
                  </template>
                </q-input>
                <q-input
                  tabindex="2"
                  square
                  clearable
                  v-model="form.confirmPassword"
                  type="password"
                  label="Confirm Password"
                  :rules="[
                    (val) =>
                      (val && val === form.password) || 'Passwords must match',
                  ]"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock" />
                  </template>
                </q-input>

                <q-btn
                  class="q-px-lg q-mt-sm full-width text-white"
                  tabindex="3"
                  type="submit"
                  unelevated
                  size="lg"
                  color="primary"
                  label="Register"
                  @click="handleSubmit"
                  :loading="submitting"
                />
              </q-form>
            </q-card-section>

            <q-card-section class="row flex-center">
              <RouterLink to="/login" class="text-grey-6"> Login</RouterLink>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-form>
  </q-page>

  <q-dialog
    v-model="displayRegistrationFailedDialog"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card>
      <q-card-section class="bg-secondary">
        <div style="font-size: 1.5em; font-weight: bold" class="q-mr-md">
          <q-avatar
            icon="sym_o_warning"
            color="primary"
            text-color="white"
            class="q-mr-md"
          />
          Registration Failed!
        </div>
      </q-card-section>
      <q-card>
        <q-card-section class="q-mr-md q-ml-lg">
          <div style="font-size: 1.2em; font-weight: bold" class="q-pb-md">
            No connection or too many requests.
          </div>
          <div class="q-pt-md text-bold">Please try again later</div>
        </q-card-section>
      </q-card>
      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" v-close-popup to="/" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="displayIsRegisteredDialog"
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
          Link sent to: <em>{{ form.email }}</em
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
