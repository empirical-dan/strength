<script setup>
import { ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth';

const $q = useQuasar();
const router = useRouter();
const auth = useAuthStore();

const leftDrawerOpen = ref(false);
const isDarkMode = ref($q.dark.isActive);
const tab = ref('Squat');

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

async function signOut() {
  if (await auth.signOut()) {
    router.push('/login');
  }
}

watch(isDarkMode, () => {
  $q.dark.toggle();
  console.log($q.dark.isActive);
});
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header height-hint="98">
      <q-toolbar class="no-hover">
        <q-toolbar-title class="flex">
          <q-item to="/">
            <q-icon
              name="sym_o_exercise"
              color="white"
              size="2rem"
              class="q-pt-md q-gutter-md"
            />
          </q-item>
          <div class="text-h6 text-italic q-gutter-sm q-mt-sm">
            Strength Stuδi/o
          </div>
        </q-toolbar-title>
        <q-btn-toggle
          v-model="isDarkMode"
          class="q-my-sm q-pr-sm"
          :size="$q.platform.is.mobile ? 'sm' : 'md'"
          style="font-size: 2em"
          no-caps
          rounded
          unelevated
          toggle-color="white"
          toggle-text-color="primary"
          color="primary"
          text-color="white"
          :options="[
            { label: 'light', value: false },
            { label: 'dark', value: true },
          ]"
        />
        <q-btn
          color="primary"
          padding="sm"
          glossy
          push
          @click="$q.fullscreen.toggle()"
          :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
        />
      </q-toolbar>
      <q-card class="shadow-up-2 shadow-4"
        ><q-tabs
          v-model="tab"
          class="text-primary"
          inactive-color="primary"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-btn
            :disable="!auth.isLoggedIn"
            class="q-ml-sm q-pl-xs"
            flat
            round
            icon="menu"
            @click="toggleLeftDrawer"
          />
          <q-tab name="Squat" label="Squat" />
          <q-tab name="Bench Press" label="Bench Press" />
          <q-tab name="Deadlift" label="Deadlift" />
        </q-tabs>
      </q-card>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" :width="200" side="left">
      <q-list>
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon color="primary" name="home" size="md" class="q-py-sm" />
          </q-item-section>
          <q-item-section class="text-h6 text-weight-bold">Home</q-item-section>
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon
              color="primary"
              name="calendar_month"
              size="md"
              class="q-py-sm"
            />
          </q-item-section>
          <q-item-section class="text-h6 text-weight-bold"
            >Workouts</q-item-section
          >
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon
              color="primary"
              name="fitness_center"
              size="md"
              class="q-py-sm"
            />
          </q-item-section>
          <q-item-section class="text-h6 text-weight-bold"
            >Exercises</q-item-section
          >
        </q-item>
        <!-- <q-separator /> -->
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon
              name="table_view"
              size="md"
              color="primary"
              class="q-py-sm"
            />
          </q-item-section>
          <q-item-section class="text-h6 text-weight-bold">Sets</q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="tune" size="md" color="primary" class="q-py-sm" />
          </q-item-section>
          <q-item-section class="text-h6 text-weight-bold"
            >Modifiers</q-item-section
          >
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="history" size="md" color="primary" class="q-py-sm" />
          </q-item-section>
          <q-item-section class="text-h6 text-weight-bold"
            >History</q-item-section
          >
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon
              name="assignment_add"
              size="md"
              color="primary"
              class="q-py-sm"
            />
          </q-item-section>
          <q-item-section class="text-h6 text-weight-bold"
            >Planner</q-item-section
          >
        </q-item>

        <q-item v-show="auth.isLoggedIn" clickable v-ripple @click="signOut">
          <q-item-section avatar>
            <q-icon
              name="sym_o_logout"
              size="md"
              color="primary"
              class="q-py-sm"
            />
          </q-item-section>
          <q-item-section class="text-h6 text-weight-bold"
            >Sign Out</q-item-section
          >
        </q-item>
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style lang="scss">
:deep(.q-toolbar.no-hover .q-focus-helper) {
  display: none;
}
</style>
src/stores/auth
