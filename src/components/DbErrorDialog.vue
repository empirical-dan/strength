<script setup lang="ts">
import { defineComponent, defineModel } from 'vue';

defineComponent({
  name: 'DbErrorDialog',
});

const dbError = defineModel<boolean>('dbError', { default: false });
</script>

<template>
  <q-dialog
    v-model="dbError"
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
          Data Error!
        </div>
      </q-card-section>
      <q-card>
        <q-card-section class="q-mx-lg">
          <div style="font-size: 1.2em; font-weight: bold" class="q-pb-sm">
            Problem saving to remote database.
          </div>

          <div class="q-pt-md text-bold text-italic">
            Please check internet connection and login.
          </div>
        </q-card-section>
      </q-card>
      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
