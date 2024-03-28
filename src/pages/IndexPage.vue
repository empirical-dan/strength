<script setup lang="ts">
import ExerciseFieldView from 'src/components/ExerciseFieldView.vue';
import ExerciseTableView from 'src/components/ExerciseTableView.vue';
import { ExerciseSet } from '../types/ExerciseSet';
import { Units } from 'src/types/Units';
import { ref } from 'vue';

const title = 'Squat'; // must limit title to 40 characters for mobile
const units: Units = 'kg';

const setData: ExerciseSet[] = [];

const mySets = ref<ExerciseSet[]>(setData);
const selectedSetId = ref<number>(-1);

// watch(mySets, () => {
//   console.log('SELECTED Set changed in parent. id=' + selectedSetId.value);
//   console.log('SELECTED Set in parent = ');
//   if (selectedSetId.value !== null && selectedSetId.value >= 0) {
//     console.log(mySets.value[selectedSetId.value]);
//   } else {
//     console.log('Empty set');
//   }
//   // reload();
// });
</script>

<template>
  <!-- v-if="selectedSetId >= 0" -->

  <ExerciseFieldView
    :key="selectedSetId"
    v-model:selectedSetId="selectedSetId"
    v-model:exerciseSets="mySets"
    :units="units"
  >
  </ExerciseFieldView>

  <!-- <ExerciseFieldView
    v-else
    :setId="selectedSetId"
    :key="-1"
    v-model:exerciseSets="mySets"
    :units="units"
  ></ExerciseFieldView> -->

  <ExerciseTableView
    v-model:selectedSetId="selectedSetId"
    v-model:exerciseSets="mySets"
    :title="title"
    :units="units"
  ></ExerciseTableView>
</template>

<!-- :exerciseSets="mySets" -->
<!-- :key="selectedSetId"  -->
