<script setup lang="ts">
import { reactive, ref } from 'vue';
import { testPattern } from 'src/patterns';
import { useAuthStore } from 'src/stores/auth';
import { useProfileStore } from 'src/stores/profile';
// import { useRouter } from 'vue-router';
// const router = useRouter();

const auth = useAuthStore();
const profile = useProfileStore();
const success = ref(false);
const showPassword = ref(false);

// Create a reactive "form" object to store the values of the form fields
const form = reactive({
  email: '',
  password: '',
  confirmPassword: '',
});

// Function to handle form submission
async function handleSubmit() {
  // Try to sign in
  await auth.signInWithPassword(form.email, form.password);
  if (auth.isLoggedIn && auth.userId !== null) {
    success.value = true;
  } else return;
  // Logged in. If user newly logged in the state of auth.isLogged in will change.
  // This will cause the popup to appear

  // If already signed in
  // then they should have been forwarded straight to the app '/home' by the router

  // check if the user has a profile here and if not create one:
  if (!profile.checkProfileExists(auth.userId)) {
    profile.updateProfile();
  }
  profile.loadProfile();
}
</script>

<template>
  <!-- style="background: linear-gradient(#8274c5, #5a4a9f)" -->

  <q-page class="window-width row justify-center items-center bg-secondary">
    <div class="column q-px-lg">
      <div class="row">
        <q-card rounded style="width: 300px; height: 395px">
          <q-card-section class="bg-primary">
            <h4 class="text-h5 text-white q-my-sm">Sign in</h4>
          </q-card-section>
          <q-card-section>
            <q-form class="q-px-sm q-pt-sm">
              <q-input
                square
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
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                label="Password"
              >
                <!-- 10 or more upper + lower + numeric characters -->

                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="showPassword ? 'visibility' : 'visibility_off'"
                    class="cursor-pointer"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </q-input>
              <q-btn
                class="q-mt-md full-width text-white"
                type="submit"
                unelevated
                size="lg"
                color="primary"
                label="Login"
                @click="handleSubmit"
              />
            </q-form>
          </q-card-section>

          <q-card-section class="row flex-center">
            <RouterLink to="/register" class="text-grey-6">
              Register</RouterLink
            >
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>

  <q-dialog
    v-model="success"
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
        <q-btn flat label="OK" color="primary" v-close-popup to="/home" />
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
