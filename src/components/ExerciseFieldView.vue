<script setup lang="ts">
import { ExerciseSet } from 'src/types/ExerciseSet';
import { Units } from 'src/types/Units';
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import {
  addSet,
  removeSet,
  calculateE1rm,
  calculatePercentageMax,
  copyTargetValues,
  isValidWeight,
} from 'src/helpers/ExerciseSetModel';

defineComponent({
  name: 'ExerciseFieldView',
});

const weightRules = [
  (val: number) =>
    (val >= 0 && val < 1000 && val % 0.25 === 0) ||
    `0-999 (to 0.25 ${props.units})`,
];
const repsRules = [
  (val: number) => (val >= 0 && val < 100 && val % 1 === 0) || '0-99 (to 1)',
];
const rpeRules = [
  (val: number) =>
    (val >= 0 && val <= 10 && val % 0.5 === 0) || '0-10 (to 0.5)',
];

const notesRules = [
  (val: string | null) =>
    typeof val !== 'string' || val.length <= 100 || 'Maximum 100 chars',
];

export type Props = {
  units?: Units;
  // exerciseSet?: ExerciseSet;
};

const props = withDefaults(defineProps<Props>(), {
  units: 'kg',
});

const rows = defineModel<ExerciseSet[]>('exerciseSets', {
  default: <ExerciseSet[]>[],
});
const selectedSetId = defineModel<number>('selectedSetId', { default: -1 });
const row = ref<ExerciseSet>({
  id: -1,
  workout_id: 1,
  exercise_id: 1,
  user_id: 1,
  target_weight: null,
  target_reps: null,
  target_rpe: null,
  actual_weight: null,
  actual_reps: null,
  actual_rpe: null,
  e1rm: null,
  percentage_max: null,
  notes: null,
});

if (rows.value?.length) {
  row.value = rows.value[selectedSetId.value];
}

const percentageMax = computed(() => {
  if (
    typeof row.value.actual_reps !== 'number' ||
    typeof row.value.actual_rpe !== 'number'
  ) {
    return null;
  }
  row.value.percentage_max;
  return Math.round(
    calculatePercentageMax(row.value.actual_reps, row.value.actual_rpe)
  );
});

const e1rm = computed(() => {
  if (
    typeof row.value.actual_reps !== 'number' ||
    typeof row.value.actual_rpe !== 'number' ||
    typeof row.value.actual_weight !== 'number'
  ) {
    return null;
  }
  return Math.round(
    calculateE1rm(
      row.value.actual_reps,
      row.value.actual_rpe,
      row.value.actual_weight
    )
  );
});

onMounted(() => {
  // weightRangeValidation(row.value.target_weight);
  console.log('FieldView: Rendered');
  console.log('FieldView: key=' + selectedSetId.value);
  console.log('Set = ');
  console.log(row.value);
});

function addRow(copy?: boolean) {
  if (copy === undefined) {
    copy = false;
  }
  // add a new set
  // then select the set that was just added
  selectedSetId.value = addSet(rows, selectedSetId, copy);
}

function removeRow() {
  selectedSetId.value = removeSet(rows, selectedSetId);
}

function copyTargets() {
  copyTargetValues(row);
}

watch(selectedSetId, () => {
  console.log('Set changed in FieldView. id=' + selectedSetId.value);
  console.log('Set in FieldView = ');
  if (selectedSetId.value !== null && selectedSetId.value >= 0) {
    console.log(rows.value[selectedSetId.value]);
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
      :disable="selectedSetId === -1"
      class="div1"
      tabindex="1"
      v-model.number="row.target_weight"
      type="number"
      step="0.25"
      min="0"
      max="999"
      :suffix="units"
      outlined
      dark
      color="white"
      bg-color="primary"
      label="Target Weight"
      :rules="weightRules"
      hide-bottom-space
      v-close-popup="!isValidWeight(row.target_weight)"
    />
    <q-input
      :disable="selectedSetId === -1"
      class="div2"
      tabindex="2"
      v-model.number="row.target_reps"
      type="number"
      step="1"
      min="0"
      max="99"
      outlined
      dark
      color="white"
      bg-color="primary"
      label="Target Reps"
      prefix="x "
      hide-bottom-space
      :rules="repsRules"
    />

    <q-input
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
      bg-color="primary"
      label="Target RPE"
      hide-bottom-space
      prefix="@ "
      :rules="rpeRules"
    />
    <q-btn
      :disable="selectedSetId === -1"
      class="div4"
      icon="sym_o_double_arrow"
      color="primary"
      push
      glossy
      style="min-height: 5vh"
      @click="copyTargets"
    >
      <q-tooltip>Copy Target Values</q-tooltip>
    </q-btn>

    <q-input
      :disable="selectedSetId === -1"
      class="div5"
      tabindex="4"
      v-model.number="row.actual_weight"
      type="number"
      step="0.25"
      min="0"
      max="999"
      :suffix="units"
      outlined
      dark
      color="white"
      bg-color="primary"
      label="Actual Weight"
      hide-bottom-space
      :rules="weightRules"
    />

    <q-input
      :disable="selectedSetId === -1"
      class="div6"
      tabindex="5"
      v-model.number="row.actual_reps"
      type="number"
      step="1"
      min="0"
      max="99"
      outlined
      dark
      color="white"
      bg-color="primary"
      label="Actual Reps"
      prefix="x "
      hide-bottom-space
      :rules="repsRules"
    />

    <q-input
      :disable="selectedSetId === -1"
      class="div7"
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
      label="Actual RPE"
      prefix="@ "
      hide-bottom-space
      :rules="rpeRules"
    />

    <q-input
      :disable="selectedSetId === -1"
      class="div8"
      tabindex="7"
      v-model="row.notes"
      type="text"
      outlined
      dark
      color="white"
      bg-color="primary"
      hide-bottom-space
      label="Notes"
      :rules="notesRules"
    />

    <q-input
      :disable="selectedSetId === -1"
      class="div9"
      v-model.number="e1rm"
      type="number"
      readonly
      outlined
      dark
      color="white"
      bg-color="primary"
      label="e1RM"
      hide-bottom-space
      :suffix="units"
    />

    <q-input
      :disable="selectedSetId === -1"
      class="div10"
      v-model.number="percentageMax"
      type="number"
      readonly
      outlined
      dark
      color="white"
      bg-color="primary"
      label="% Max"
      hide-bottom-space
      suffix=" %"
    />

    <q-btn
      :disable="selectedSetId === -1"
      class="div11"
      icon="sym_o_playlist_add"
      color="primary"
      push
      glossy
      style="min-height: 5vh"
      @click="addRow(true)"
    >
      <q-tooltip>Copy Set</q-tooltip>
    </q-btn>

    <q-btn
      class="div12"
      icon="sym_o_docs_add_on"
      color="primary"
      push
      glossy
      style="min-height: 5vh"
      @click="addRow(false)"
    >
      <q-tooltip>Add Empty Set</q-tooltip>
    </q-btn>

    <q-btn
      :disable="selectedSetId === -1"
      class="div13"
      icon="sym_o_playlist_remove"
      color="primary"
      push
      glossy
      style="min-height: 5vh"
      @click="removeRow"
    >
      <q-tooltip>Remove Set</q-tooltip>
    </q-btn>
  </div>
</template>

<style>
.parent {
  display: grid;
  grid-template-columns: 1fr repeat(2, 0.5fr) 1fr;
  grid-template-rows: repeat(4, 1fr);
  column-gap: 0.5vw;
  row-gap: 0.5vh;
}

.div1 {
  grid-area: 1 / 1 / 2 / 2;
}
.div2 {
  grid-area: 2 / 1 / 3 / 2;
}
.div3 {
  grid-area: 3 / 1 / 4 / 2;
}
.div4 {
  grid-area: 2 / 2 / 3 / 4;
}
.div5 {
  grid-area: 1 / 4 / 2 / 5;
}
.div6 {
  grid-area: 2 / 4 / 3 / 5;
}
.div7 {
  grid-area: 3 / 4 / 4 / 5;
}
.div8 {
  grid-area: 4 / 2 / 5 / 4;
}
.div9 {
  grid-area: 4 / 1 / 5 / 2;
}
.div10 {
  grid-area: 4 / 4 / 5 / 5;
}
.div11 {
  grid-area: 1 / 2 / 2 / 3;
}
.div12 {
  grid-area: 1 / 3 / 2 / 4;
}
.div13 {
  grid-area: 3 / 2 / 4 / 4;
}

/* .q-input .q-field__control {
  font-size: 1rem;
} */
</style>
