<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { ExerciseSet } from '../types/ExerciseSet';
import { ExerciseTableColumn } from '../types/ExerciseTableColumn';
import { Units } from 'src/types/Units';
import { useQuasar } from 'quasar';
import {
  addSet,
  removeSet,
  moveSetUp,
  moveSetDown,
  isValidWeight,
  isValidReps,
  isValidRpe,
  isValidNotes,
  isValidSet,
} from '../helpers/ExerciseSetModel';

const $q = useQuasar();

export type Props = {
  title?: string;
  units?: Units;
  // exerciseSets?: ExerciseSet[];
};

const props = withDefaults(defineProps<Props>(), {
  title: 'New Exercise',
  units: 'kg',
  // exerciseSets: () =>
  //   // object and array default props must be assigned via a factory
  //   <ExerciseSet[]>[],
});

// const radio = ref(null);

const invalid = ref(false);

const selectedRowId = defineModel<number>('selectedSetId', { default: -1 });
const rows = defineModel<ExerciseSet[]>('exerciseSets', {
  default: <ExerciseSet[]>[],
});

onMounted(() => {
  console.log('TableView: Rendered');
  console.log('TableView: selectedRowId=' + selectedRowId.value);
  console.log('Set = ');
  if (selectedRowId.value >= 0) {
    console.log(rows[selectedRowId.value].value);
  }
});

watch(selectedRowId, (newValue, oldValue) => {
  // don't perform validation if there are no rows or if the last row was just deleted
  if (oldValue === -1 || newValue === -1) {
    return;
  }
  if (!isValidSet(rows.value[oldValue])) {
    selectedRowId.value = oldValue;
    invalid.value = true;
    console.log('Invalid weight in set: ' + oldValue);
  }

  console.log('Set changed in ExerciseTableView. id=' + selectedRowId.value);
  console.log('Set in ExerciseTableView = ');

  // validate oldSelectedSet in ExerciseFieldView before re-rendering
  // or maybe get selectRow to call all the validation methods and refuse to change rows if it fails.

  console.log('Old set was id=' + oldValue);

  // reload();
});

// function changeRow(value: number, evt: Event) {
//   console.log('Radio button selected. Trying to change row to: ' + value);
//   console.log(
//     'Radio button previously selected row was: ' + selectedRowId.value
//   );
//   console.log(evt);
//   console.log('Radio button that was selected = ');
//   console.log(radio.value);
// }

function selectRow(id: number): boolean {
  // only perform re-validation on selecting a new row or it becomes intrusive
  if (id === selectedRowId.value) {
    return true;
  }
  if (!isValidSet(rows.value[selectedRowId.value])) {
    invalid.value = true;
    return false;
  }

  console.log('SELECTING NEW ROW... id = ' + id);
  console.log(rows.value[id]);
  selectedRowId.value = id;
  return true;
}

const pagination = ref({
  rowsPerPage: 0,
});

const rowCount = ref(rows.value.length);

function addRow(copy?: boolean) {
  if (copy === undefined) {
    copy = false;
  }
  // add a new set.
  // then select the set that was just added.
  selectedRowId.value = addSet(rows, selectedRowId, copy);
}

function removeRow() {
  selectedRowId.value = removeSet(rows, selectedRowId);
  console.log('Row count = ' + rowCount.value);
}

function moveRowUp() {
  selectedRowId.value = moveSetUp(rows, selectedRowId);
}

function moveRowDown() {
  selectedRowId.value = moveSetDown(rows, selectedRowId);
}

const columns: ExerciseTableColumn[] = [
  {
    name: 'radio',
    required: true,
    label: '',
    align: 'left',
    field: '',
    sortable: false,
  },

  {
    name: 'set_number',
    required: true,
    label: 'Set',
    align: 'center',
    field: (set: ExerciseSet) => '#' + set.id + 1,
    sortable: false,
  },
  {
    name: 'target_weight',
    required: false,
    align: 'center',
    label: 'Target Weight',
    field: (set: ExerciseSet) =>
      set.target_weight?.toString + ' ' + props.units,
    sortable: false,
  },
  {
    name: 'target_reps',
    required: false,
    label: 'Target Reps',
    align: 'center',
    field: (set: ExerciseSet) => 'x ' + set.target_reps,
    sortable: false,
  },
  {
    name: 'target_rpe',
    required: false,
    label: 'Target RPE',
    align: 'center',
    field: (set: ExerciseSet) => '@ ' + set.target_rpe,
    sortable: false,
  },
  {
    name: 'actual_weight',
    required: true,
    label: 'Actual Weight',
    align: 'center',
    field: (set: ExerciseSet) => set.actual_weight + ' ' + props.units,
    sortable: false,
  },
  {
    name: 'actual_reps',
    required: true,
    label: 'Actual Reps',
    align: 'center',
    field: (set: ExerciseSet) => 'x ' + set.actual_reps,
    sortable: false,
  },
  {
    name: 'actual_rpe',
    required: true,
    label: 'Actual RPE',
    align: 'center',
    field: (set: ExerciseSet) => '@ ' + set.actual_rpe,
    sortable: false,
  },
  {
    name: 'e1rm',
    required: false,
    label: 'e1RM',
    align: 'center',
    field: (set: ExerciseSet) => set.e1rm + ' ' + props.units,
    sortable: false,
  },
  {
    name: 'percentage_max',
    required: false,
    label: '% Max',
    align: 'center',
    field: (set: ExerciseSet) => set.percentage_max + ' %',
    sortable: false,
  },
  {
    name: 'notes',
    required: false,
    label: 'Notes',
    align: 'left',
    field: (set: ExerciseSet) => set.notes + '',
    sortable: false,
  },
];

const visibleColumns = ref(
  columns
    .filter((column) => {
      if ($q.platform.is.mobile) {
        return column.name !== 'notes';
      } else {
        return column.required === false && column.name !== 'notes';
      }
    })
    .map((column) => column.name)
);

const errorWeight = ref(false);
const errorMessageWeight = ref('');
function weightRangeValidation(val: number | string | null | undefined) {
  if (isValidWeight(val)) {
    errorWeight.value = false;
    errorMessageWeight.value = '';
    return true;
  }
  errorWeight.value = true;
  errorMessageWeight.value = `0-999 (to 0.25 ${props.units})`;
  return false;
}

const errorReps = ref(false);
const errorMessageReps = ref('');
function repRangeValidation(val?: number) {
  if (isValidReps(val)) {
    errorReps.value = false;
    errorMessageReps.value = '';
    return true;
  }
  errorReps.value = true;
  errorMessageReps.value = '0-99 (to 1)';
  return false;
}

const errorRpe = ref(false);
const errorMessageRpe = ref('');
function rpeRangeValidation(val?: number) {
  if (isValidRpe(val)) {
    errorRpe.value = false;
    errorMessageRpe.value = '';
    return true;
  }
  errorRpe.value = true;
  errorMessageRpe.value = '0-10 (to 0.5)';
  return false;
}

const errorNotes = ref(false);
const errorMessageNotes = ref('');
function notesValidation(val?: string) {
  if (isValidNotes(val)) {
    errorNotes.value = false;
    errorMessageNotes.value = '';
    return true;
  }
  errorNotes.value = true;
  errorMessageNotes.value = 'Maximum 100 chars';
  return false;
}
</script>

<template>
  <q-dialog
    v-model="invalid"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card>
      <q-card-section class="bg-secondary">
        <div style="font-size: 1.5em; font-weight: bold">
          <q-avatar
            icon="sym_o_exclamation"
            color="primary"
            text-color="white"
            class="q-mr-md"
          />
          Set {{ selectedRowId + 1 }}
        </div>
      </q-card-section>
      <q-card>
        <q-card-section class="q-mx-sm">
          <strong>Please validate data:</strong><br />Weights: 0-999
          {{ units }} (to nearest 0.25). <br />Repetitions: 0-99 (whole
          numbers). <br />RPE: 0-10 (to nearest 0.5). <br />Notes: Maximum 100
          characters.
        </q-card-section>
      </q-card>
      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <div class="q-pa-md">
    <q-table
      :style="$q.platform.is.mobile ? `max-height: 350px` : `max-height: 500px`"
      flat
      bordered
      dense
      :title="props.title"
      :rows="rows"
      :columns="columns"
      :visible-columns="visibleColumns"
      row-key="id"
      virtual-scroll
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
      hide-pagination
      no-data-label="Please add a Set to begin."
    >
      <template #top>
        <q-btn
          :disable="selectedRowId === -1"
          dense
          glossy
          push
          color="primary"
          icon="sym_o_playlist_add"
          @click="addRow(true)"
        >
          <q-tooltip v-if="!$q.platform.is.mobile">Copy Set</q-tooltip>
        </q-btn>
        <q-btn
          dense
          class="q-ml-sm"
          glossy
          push
          color="primary"
          icon="sym_o_docs_add_on"
          @click="addRow(false)"
        >
          <q-tooltip v-if="!$q.platform.is.mobile">Add Empty Set</q-tooltip>
        </q-btn>
        <q-btn
          :disable="selectedSetId === -1"
          dense
          glossy
          push
          class="q-ml-sm"
          color="primary"
          icon="sym_o_playlist_remove"
          @click="removeRow"
        >
          <q-tooltip v-if="!$q.platform.is.mobile">Remove Set</q-tooltip>
        </q-btn>
        <q-btn
          :disable="selectedSetId === -1"
          dense
          glossy
          push
          class="q-ml-sm"
          color="primary"
          icon="sym_o_arrow_upward"
          @click="moveRowUp"
        >
          <q-tooltip v-if="!$q.platform.is.mobile">Move Up</q-tooltip>
        </q-btn>
        <q-btn
          :disable="selectedSetId === -1"
          dense
          glossy
          push
          class="q-ml-sm"
          color="primary"
          icon="sym_o_arrow_downward"
          @click="moveRowDown"
        >
          <q-tooltip v-if="!$q.platform.is.mobile">Move Down</q-tooltip>
        </q-btn>
        <q-space></q-space>
        <q-select
          v-model="visibleColumns"
          multiple
          dense
          options-dense
          :display-value="$q.lang.table.columns"
          emit-value
          :options="
            columns.filter((column) => {
              return column.required === false;
            })
          "
          option-value="name"
          options-cover
          style="min-width: 95px; min-height: 40px; font-size: 0.7rem"
        />
      </template>

      <template #body="props">
        <q-tr :props="props">
          <q-radio
            :key="props.rowIndex"
            v-model="selectedRowId"
            :val="props.rowIndex"
          />
          <q-td key="set_number" :props="props">
            {{ '#' + (props.row.id + 1) }}
          </q-td>
          <q-td key="target_weight" :props="props" class="cursor-pointer">
            {{
              props.row.target_weight
                ? props.row.target_weight + ' ' + units
                : null
            }}

            <q-popup-edit
              v-if="!$q.fullscreen.isActive || !$q.platform.is.mobile"
              v-model="props.row.target_weight"
              auto-save
              :validate="weightRangeValidation"
              @hide="weightRangeValidation"
              v-slot="scope"
            >
              <q-input
                type="number"
                step="0.25"
                min="0"
                max="999"
                v-model.number="scope.value"
                :error="errorWeight"
                :error-message="errorMessageWeight"
                :rules="[
                  (val: any) =>
                    scope.validate(scope.value) || `${errorMessageWeight}`,
                ]"
                dense
                autofocus
                @keyup.enter="scope.set"
                v-close-popup="!selectRow(props.rowIndex)"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="target_reps" :props="props" class="cursor-pointer">
            {{ props.row.target_reps ? 'x ' + props.row.target_reps : null }}

            <q-popup-edit
              v-if="!$q.fullscreen.isActive || !$q.platform.is.mobile"
              v-model="props.row.target_reps"
              auto-save
              :validate="repRangeValidation"
              @hide="repRangeValidation"
              v-slot="scope"
            >
              <q-input
                type="number"
                step="1"
                min="0"
                max="99"
                v-model.number="scope.value"
                :error="errorReps"
                :error-message="errorMessageReps"
                :rules="[
                  (val: any) => scope.validate(scope.value) || `${errorMessageReps}`,
                ]"
                dense
                autofocus
                @keyup.enter="scope.set"
                v-close-popup="!selectRow(props.rowIndex)"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="target_rpe" :props="props" class="cursor-pointer">
            {{ props.row.target_rpe ? '@ ' + props.row.target_rpe : null }}
            <q-popup-edit
              v-if="!$q.fullscreen.isActive || !$q.platform.is.mobile"
              v-model="props.row.target_rpe"
              auto-save
              :validate="rpeRangeValidation"
              @hide="rpeRangeValidation"
              v-slot="scope"
            >
              <q-input
                type="number"
                step="0.5"
                min="0"
                max="10"
                v-model.number="scope.value"
                :error="errorRpe"
                :error-message="errorMessageRpe"
                :rules="[
                  (val: any) => scope.validate(scope.value) || `${errorMessageRpe}`,
                ]"
                dense
                autofocus
                @keyup.enter="scope.set"
                v-close-popup="!selectRow(props.rowIndex)"
              />
            </q-popup-edit>
          </q-td>

          <q-td key="actual_weight" :props="props" class="cursor-pointer">
            {{
              props.row.actual_weight
                ? props.row.actual_weight + ' ' + units
                : null
            }}
            <q-popup-edit
              v-if="!$q.fullscreen.isActive || !$q.platform.is.mobile"
              v-model="props.row.actual_weight"
              auto-save
              :validate="weightRangeValidation"
              @hide="weightRangeValidation"
              v-slot="scope"
            >
              <q-input
                type="number"
                step="0.25"
                min="0"
                max="999"
                v-model.number="scope.value"
                :error="errorWeight"
                :error-message="errorMessageWeight"
                :rules="[
                  (val: any) =>
                    scope.validate(scope.value) || `${errorMessageWeight}`,
                ]"
                dense
                autofocus
                @keyup.enter="scope.set"
                v-close-popup="!selectRow(props.rowIndex)"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="actual_reps" :props="props" class="cursor-pointer">
            {{ props.row.actual_reps ? 'x ' + props.row.actual_reps : null }}
            <q-popup-edit
              v-if="!$q.fullscreen.isActive || !$q.platform.is.mobile"
              v-model="props.row.actual_reps"
              auto-save
              :validate="repRangeValidation"
              @hide="repRangeValidation"
              v-slot="scope"
            >
              <q-input
                type="number"
                step="1"
                min="0"
                max="99"
                v-model.number="scope.value"
                :error="errorReps"
                :error-message="errorMessageReps"
                :rules="[
                  (val: any) => scope.validate(scope.value) || `${errorMessageReps}`,
                ]"
                dense
                autofocus
                @keyup.enter="scope.set"
                v-close-popup="!selectRow(props.rowIndex)"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="actual_rpe" :props="props" class="cursor-pointer">
            {{ props.row.actual_rpe ? '@ ' + props.row.actual_rpe : null }}
            <q-popup-edit
              v-if="!$q.fullscreen.isActive || !$q.platform.is.mobile"
              v-model="props.row.actual_rpe"
              auto-save
              :validate="rpeRangeValidation"
              @hide="rpeRangeValidation"
              v-slot="scope"
            >
              <q-input
                type="number"
                step="0.5"
                min="0"
                max="10"
                v-model.number="scope.value"
                :error="errorRpe"
                :error-message="errorMessageRpe"
                :rules="[
                  (val: any) => scope.validate(scope.value) || `${errorMessageRpe}`,
                ]"
                dense
                autofocus
                @keyup.enter="scope.set"
                v-close-popup="!selectRow(props.rowIndex)"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="e1rm" :props="props">
            {{ props.row.e1rm ? props.row.e1rm + ' ' + units : '' }}
          </q-td>
          <q-td key="percentage_max" :props="props">
            {{
              props.row.percentage_max ? props.row.percentage_max + ' %' : ''
            }}
          </q-td>
          <q-td key="notes" :props="props" class="cursor-pointer" width="100%">
            {{ props.row.notes }}
            <q-popup-edit
              v-if="!$q.fullscreen.isActive || !$q.platform.is.mobile"
              v-model="props.row.notes"
              auto-save
              :validate="notesValidation"
              @hide="notesValidation"
              v-slot="scope"
            >
              <q-input
                type="text"
                v-model="scope.value"
                :rules="[
                  (val: string | any[]) => val.length <= 100 || 'Maximum 100 characters',
                ]"
                dense
                autofocus
                @keyup.enter="scope.set"
                v-close-popup="!selectRow(props.rowIndex)"
              />
            </q-popup-edit>
          </q-td>
        </q-tr>
      </template>
      <!-- <template #bottom> Selected row id={{ selectedRowId }} </template> -->
    </q-table>
  </div>
</template>

<style>
.q-dialog__backdrop.fixed-full {
  backdrop-filter: blur(3px);
}
</style>
