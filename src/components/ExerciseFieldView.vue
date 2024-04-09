<script setup lang="ts">
import { ExerciseSet } from 'src/types/ExerciseSet';
import { Units } from 'src/types/Units';
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import { useSetsStore } from 'src/stores/sets';
import DbErrorDialog from 'src/components/DbErrorDialog.vue';
const sets = useSetsStore();
const dbError = ref(false);
const loading = ref(false);
const showTargets = ref(true);

defineComponent({
  name: 'ExerciseFieldView',
});

const weightRules = [
  (val: number) =>
    (val >= 0 && val < 10000 && val % 0.25 === 0) ||
    `0-9999 (to 0.25 ${props.units})`,
];
const repsRules = [
  (val: number) => (val >= 0 && val < 1000 && val % 1 === 0) || '0-999 (to 1)',
];
const rpeRules = [
  (val: number) =>
    (val >= 0 && val <= 10 && val % 0.5 === 0) || '0-10 (to 0.5)',
];

// const notesRules = [
//   (val: string | null) =>
//     typeof val !== 'string' || val.length <= 100 || 'Maximum 100 chars',
// ];

export type Props = {
  units?: Units;
};

const props = withDefaults(defineProps<Props>(), {
  units: 'kg',
});

const selectedSetId = defineModel<number>('selectedSetId', { default: -1 });
const row = ref<ExerciseSet>({
  id: -1,
  set_number: -1,
  workout_id: 1,
  exercise_id: 1,
  user_id: '',
  target_weight: null,
  target_reps: null,
  target_rpe: null,
  actual_weight: null,
  actual_reps: null,
  actual_rpe: null,
  e1rm: null,
  percentage_max: null,
  note: null,
});

if (sets.data.length) {
  row.value = sets.data[selectedSetId.value];
}

const percentageMax = computed(() => {
  const rowId = selectedSetId.value;
  if (rowId === -1) return;
  if (typeof rowId === 'number') {
    const value = sets.calculatePercentageMax(rowId);
    if (value) {
      return Math.round(value);
    }
  }
  return null;
});

const e1rm = computed(() => {
  const rowId = selectedSetId.value;
  if (rowId === -1) return;
  if (typeof rowId === 'number') {
    const value = sets.calculateE1rm(rowId);
    if (value) {
      return Math.round(value);
    }
  }
  return null;
});

onMounted(() => {
  // weightRangeValidation(row.value.target_weight);
  console.log('FieldView: Rendered');
  console.log('FieldView: key=' + selectedSetId.value);
  console.log('Set = ');
  console.log(row.value);
});

async function addRow(copy?: boolean) {
  loading.value = true;
  if (copy === undefined) {
    copy = false;
  }
  // add a new set
  // then select the set that was just added
  const { success, row } = await sets.addSet(selectedSetId.value, copy);
  selectedSetId.value = row;
  if (!success) {
    dbError.value = true;
  }
  loading.value = false;
}

async function removeRow() {
  loading.value = true;
  const { success, row } = await sets.removeSet(selectedSetId.value);
  selectedSetId.value = row;
  if (!success) {
    dbError.value = true;

    // selectedSetId.value = sets.removeSet(selectedSetId.value);
  }
  loading.value = false;
}

async function copyTargets() {
  loading.value = true;
  if (!(await sets.copyTargetValues(selectedSetId.value))) {
    dbError.value = true;
    console.log('Unable to save to DB');
  }
  loading.value = false;
}

watch(selectedSetId, () => {
  console.log('Set changed in FieldView. id=' + selectedSetId.value);
  console.log('Set in FieldView = ');
  if (selectedSetId.value !== null && selectedSetId.value >= 0) {
    console.log(sets.data[selectedSetId.value]);
  } else {
    console.log('Empty set');
  }
});

watch(percentageMax, () => {
  if (typeof percentageMax.value !== 'number') {
    return;
  }
  row.value.percentage_max = percentageMax.value;
});

watch(e1rm, () => {
  if (typeof e1rm.value !== 'number') {
    return;
  }
  row.value.e1rm = e1rm.value;
});
</script>

<template>
  <div class="parent bg-secondary rounded-borders q-ma-md">
    <q-input
      v-show="showTargets"
      :disable="selectedSetId === -1"
      class="div1"
      tabindex="1"
      v-model.number="row.target_weight"
      type="number"
      step="0.25"
      min="0"
      max="9999"
      :suffix="units"
      outlined
      dark
      color="white"
      bg-color="accent"
      label="Target Weight"
      :rules="weightRules"
      hide-bottom-space
    />
    <q-input
      v-show="showTargets"
      :disable="selectedSetId === -1"
      class="div2"
      tabindex="2"
      v-model.number="row.target_reps"
      type="number"
      step="1"
      min="0"
      max="999"
      outlined
      dark
      color="white"
      bg-color="accent"
      label="Target Reps"
      prefix="x "
      hide-bottom-space
      :rules="repsRules"
    />

    <q-input
      v-show="showTargets"
      :disable="selectedSetId === -1"
      class="div3"
      tabindex="3"
      v-model.number="row.target_rpe"
      type="number"
      step="0.5"
      min="0"
      max="10"
      outlined
      dark
      color="white"
      bg-color="accent"
      label="Target RPE"
      hide-bottom-space
      prefix="@ "
      :rules="rpeRules"
    />

    <q-input
      :disable="selectedSetId === -1"
      class="div4"
      tabindex="4"
      v-model.number="row.actual_weight"
      type="number"
      step="0.25"
      min="0"
      max="9999"
      :suffix="units"
      outlined
      dark
      color="white"
      bg-color="primary"
      label="Weight"
      hide-bottom-space
      :rules="weightRules"
    />

    <q-input
      :disable="selectedSetId === -1"
      class="div5"
      tabindex="5"
      v-model.number="row.actual_reps"
      type="number"
      step="1"
      min="0"
      max="999"
      outlined
      dark
      color="white"
      bg-color="primary"
      label="Reps"
      prefix="x "
      hide-bottom-space
      :rules="repsRules"
    />

    <q-input
      :disable="selectedSetId === -1"
      class="div6"
      tabindex="6"
      v-model.number="row.actual_rpe"
      type="number"
      step="0.5"
      min="0"
      max="10"
      outlined
      dark
      color="white"
      bg-color="primary"
      label="RPE"
      prefix="@ "
      hide-bottom-space
      :rules="rpeRules"
    />

    <q-btn
      v-show="showTargets"
      :disable="selectedSetId === -1"
      class="div7"
      icon="keyboard_arrow_down"
      color="accent"
      size="sm"
      push
      glossy
      dense
      @click="copyTargets"
      :loading="loading"
      label="copy"
    >
      <q-tooltip>Copy Target Values</q-tooltip>
    </q-btn>
    <q-toggle
      size="xs"
      v-model="showTargets"
      dense
      color="accent"
      style="font-size: 0.75em"
      class="div8 text-accent q-mx-xs"
      label="Targets"
      checked-icon="check"
      unchecked-icon="clear"
    ></q-toggle>
  </div>

  <DbErrorDialog v-model="dbError"> </DbErrorDialog>
</template>

<style>
.parent {
  display: grid;
  grid-template-columns: repeat(3, 1fr) 0.25fr;
  grid-template-rows: repeat(auto-fill, 1fr);
  column-gap: 0.5vw;
  row-gap: 0.5vh;
}

.div1 {
  grid-area: 1 / 1 / 2 / 2;
}
.div2 {
  grid-area: 1 / 2 / 2 / 3;
}
.div3 {
  grid-area: 1 / 3 / 2 / 4;
}
.div4 {
  grid-area: 2 / 1 / 3 / 2;
}
.div5 {
  grid-area: 2 / 2 / 3 / 3;
}
.div6 {
  grid-area: 2 / 3 / 3 / 4;
}
.div7 {
  grid-area: 1 / 4 / 2 / 5;
}
.div8 {
  grid-area: 2 / 4 / 3 / 5;
}

/* .q-input .q-field__control {
  font-size: 1rem;
} */
</style>
src/stores/auth
