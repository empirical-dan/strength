<script setup lang="ts">
import ExerciseFieldView from 'src/components/ExerciseFieldView.vue';
import ExerciseTableView from 'src/components/ExerciseTableView.vue';
import { Units } from 'src/types/Units';
import { onBeforeMount, ref } from 'vue';
import { supabase } from '../supabase/supabase';
import { useSetsStore } from 'stores/sets';
import { useAuthStore } from 'src/stores/auth';
import { useProfileStore } from 'stores/profile';

const title = 'Squat'; // must limit title to 40 characters for mobile
const units: Units = 'kg';

const sets = useSetsStore();
const profile = useProfileStore();
if (sets.data.length) {
  if (
    profile.data.current_set === null ||
    profile.data.current_set < 0 ||
    profile.data.current_set >= sets.rowCount
  ) {
    sets.selectedSet = 0;
  } else {
    // delete this line once using profile.data.current_set:
    sets.selectedSet = profile.data.current_set;
  }
} else {
  sets.selectedSet = -1;
}

// const auth = useAuthStore();
// const profile = useProfileStore();

// const user = useUserStore();

// onBeforeMount(async () => {
//   const { data, error } = await supabase
//     .from('sets')
//     .select()
//     .match({ exercise_id: 212, user_id: auth.userId })
//     .order('set_number');

//   console.log(error);
//   console.log('DB user_id = ');
//   console.log(auth.userId);
//   console.log('Data from DB:');
//   console.log(data);
//   if (data !== null && data.length > 0) {
//     sets.data = data;
//     selectedSetId.value = 0;
//   }
//   console.log(sets.data);

//   profile.loadProfile();
// });

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

  <ExerciseFieldView :key="sets.selectedSet" :units="units">
  </ExerciseFieldView>

  <!-- <ExerciseFieldView
    v-else
    :setId="selectedSetId"
    :key="-1"
    v-model:exerciseSets="sets.data"
    :units="units"
  ></ExerciseFieldView> -->

  <ExerciseTableView :title="title" :units="units"></ExerciseTableView>
</template>

<!-- :exerciseSets="mySets" -->
<!-- :key="selectedSetId"  -->
