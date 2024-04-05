<script setup lang="ts">
import ExerciseFieldView from 'src/components/ExerciseFieldView.vue';
import ExerciseTableView from 'src/components/ExerciseTableView.vue';
import { Units } from 'src/types/Units';
import { onBeforeMount, ref } from 'vue';
import { supabase } from '../supabase/supabase';
import { useSetsStore } from 'stores/sets';

const title = 'Squat'; // must limit title to 40 characters for mobile
const units: Units = 'kg';

const sets = useSetsStore();

const selectedSetId = ref<number>(-1);
// const user = useUserStore();

onBeforeMount(async () => {
  let { data, error } = await supabase
    .from('sets')
    .select()
    .eq('exercise_id', 212)
    .order('set_number');

  console.log(error);
  console.log('Data from DB:');
  console.log(data);
  if (data !== null) {
    sets.data = data;
    selectedSetId.value = 0;
  }
  console.log(sets.data);
});

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
    :units="units"
  >
  </ExerciseFieldView>

  <!-- <ExerciseFieldView
    v-else
    :setId="selectedSetId"
    :key="-1"
    v-model:exerciseSets="sets.data"
    :units="units"
  ></ExerciseFieldView> -->

  <ExerciseTableView
    v-model:selectedSetId="selectedSetId"
    :title="title"
    :units="units"
  ></ExerciseTableView>
</template>

<!-- :exerciseSets="mySets" -->
<!-- :key="selectedSetId"  -->
