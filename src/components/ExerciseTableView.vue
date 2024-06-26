<script setup lang="ts">
import { computed, defineComponent, onMounted, ref, toRefs, watch } from 'vue';
import { ExerciseSet } from '../types/ExerciseSet';
import { ExerciseTableColumn } from '../types/ExerciseTableColumn';
import { Units } from 'src/types/Units';
import { useQuasar } from 'quasar';
import { useSetsStore } from 'src/stores/sets';
import DbErrorDialog from './DbErrorDialog.vue';
import { useProfileStore } from 'src/stores/profile';
import { storeToRefs } from 'pinia';

const $q = useQuasar();
// const visibleColumns = useProfileStore().visibleColumns;
const sets = useSetsStore();
// const visibleColumns = ref(['note']);
const profile = useProfileStore();

const invalid = ref(false);
const displayDbErrorDialog = ref(false);
// const current_set = defineModel<number>('current_set', { default: -1 });
const loading = ref(false);
const currentRadio = ref(sets.selectedSet);

defineComponent({
  name: 'ExerciseTableView',
});

export type Props = {
  title?: string;
  units?: Units;
};
const props = withDefaults(defineProps<Props>(), {
  title: 'New Exercise',
  units: 'kg',
});

async function selectRow(id: number) {
  // Perform validation of data when attempting to change row by whatever means:
  // Only perform re-validation on selecting a new row or it becomes intrusive
  if (id === sets.selectedSet) {
    console.log('Re-selected current set');
    // Tried to re-select current set. No need to do anything
    return true;
  }
  loading.value = true;
  if (!sets.isValidSet(sets.data[sets.selectedSet])) {
    invalid.value = true;
    loading.value = false;
    return false;
  }
  // current set is valid so update it:
  await sets.updateSet(sets.selectedSet);
  console.log('SELECTING NEW ROW... id = ' + id);
  console.log(sets.data[id]);
  sets.selectSet(id);
  currentRadio.value = id;
  profile.data.current_set = id;
  await profile.updateProfile();
  loading.value = false;
  return true;
}

const pagination = ref({
  rowsPerPage: 0,
});

async function addRow(copy?: boolean) {
  loading.value = true;
  if (copy === undefined) {
    copy = false;
  }
  if (
    sets.selectedSet !== -1 &&
    !sets.isValidSet(sets.data[sets.selectedSet])
  ) {
    invalid.value = true;
    loading.value = false;
    return false;
  }
  // current set is valid so update it:
  await sets.updateSet(sets.selectedSet);
  // add a new set.
  // then select the set that was just added.
  // take this out and put userId into the Sets store
  const { success, row } = await sets.addSet(sets.selectedSet, copy);
  sets.selectSet(row);
  currentRadio.value = row;
  if (success) {
    profile.data.current_set = row;
    await profile.updateProfile();
  } else {
    displayDbErrorDialog.value = true;
  }
  loading.value = false;
}

async function removeRow() {
  loading.value = true;
  if (!sets.isValidSet(sets.data[sets.selectedSet])) {
    invalid.value = true;
    loading.value = false;
    return false;
  }
  // current set is valid so update it:
  await sets.updateSet(sets.selectedSet);
  const { success, row } = await sets.removeSet(sets.selectedSet);
  sets.selectSet(row);
  currentRadio.value = row;
  if (success) {
    profile.data.current_set = row;
    await profile.updateProfile();
  } else {
    displayDbErrorDialog.value = true;
  }
  loading.value = false;
}

async function moveRowUp() {
  if (sets.selectedSet === 0) return;
  loading.value = true;
  if (!sets.isValidSet(sets.data[sets.selectedSet])) {
    invalid.value = true;
    loading.value = false;
    return false;
  }
  // current set is valid so update it:
  await sets.updateSet(sets.selectedSet);
  const { success, row } = await sets.moveSetUp(sets.selectedSet);
  sets.selectSet(row);
  currentRadio.value = row;
  if (success) {
    profile.data.current_set = row;
    await profile.updateProfile();
  } else {
    displayDbErrorDialog.value = true;
  }
  loading.value = false;
}

async function moveRowDown() {
  if (sets.selectedSet >= sets.rowCount - 1) return;
  loading.value = true;
  if (!sets.isValidSet(sets.data[sets.selectedSet])) {
    invalid.value = true;
    loading.value = false;
    return false;
  }
  // current set is valid so update it:
  await sets.updateSet(sets.selectedSet);
  const { success, row } = await sets.moveSetDown(sets.selectedSet);
  sets.selectSet(row);
  currentRadio.value = row;
  if (success) {
    profile.data.current_set = row;
    await profile.updateProfile();
  } else {
    displayDbErrorDialog.value = true;
  }
  loading.value = false;
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
    field: (set: ExerciseSet) => '#' + set.set_number + 1,
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
    name: 'note',
    required: false,
    label: 'Notes',
    align: 'left',
    field: (set: ExerciseSet) => set.note + '',
    sortable: false,
  },
];

const errorWeight = ref(false);
const errorMessageWeight = ref('');
function weightRangeValidation(val: number | string | null | undefined) {
  if (sets.isValidWeight(val)) {
    errorWeight.value = false;
    errorMessageWeight.value = '';
    return true;
  }
  errorWeight.value = true;
  errorMessageWeight.value = `0-9999 (to 0.25 ${props.units})`;
  return false;
}

const errorReps = ref(false);
const errorMessageReps = ref('');
function repRangeValidation(val?: number) {
  if (sets.isValidReps(val)) {
    errorReps.value = false;
    errorMessageReps.value = '';
    return true;
  }
  errorReps.value = true;
  errorMessageReps.value = '0-999 (to 1)';
  return false;
}

const errorRpe = ref(false);
const errorMessageRpe = ref('');
function rpeRangeValidation(val?: number) {
  if (sets.isValidRpe(val)) {
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
function noteValidation(val?: string) {
  if (sets.isValidNotes(val)) {
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
          Set {{ sets.selectedSet ?? +1 }}
        </div>
      </q-card-section>
      <q-card>
        <q-card-section class="q-mx-sm">
          <strong>Please validate data:</strong><br />Weights: 0-9999
          {{ units }} (to nearest 0.25). <br />Repetitions: 0-999 (whole
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
      :rows="sets.data"
      :columns="columns"
      :visible-columns="profile.visibleColumns"
      row-key="set_number"
      virtual-scroll
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
      hide-pagination
      no-data-label="Please add a Set to begin."
    >
      <template #top>
        <q-btn-group outline push>
          <q-btn
            :disable="sets.selectedSet === -1"
            dense
            glossy
            push
            color="primary"
            icon="sym_o_playlist_add"
            @click="addRow(true)"
            :loading="loading"
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
            :loading="loading"
          >
            <q-tooltip v-if="!$q.platform.is.mobile">Add Empty Set</q-tooltip>
          </q-btn>
          <q-btn
            :disable="sets.selectedSet === -1"
            dense
            glossy
            push
            class="q-ml-sm"
            color="primary"
            icon="sym_o_playlist_remove"
            @click="removeRow"
            :loading="loading"
          >
            <q-tooltip v-if="!$q.platform.is.mobile">Remove Set</q-tooltip>
          </q-btn>
          <q-btn
            :disable="sets.selectedSet === -1"
            dense
            glossy
            push
            class="q-ml-sm"
            color="primary"
            icon="sym_o_arrow_upward"
            @click="moveRowUp"
            :loading="loading"
          >
            <q-tooltip v-if="!$q.platform.is.mobile">Move Up</q-tooltip>
          </q-btn>
          <q-btn
            :disable="sets.selectedSet === -1"
            dense
            glossy
            push
            class="q-ml-sm"
            color="primary"
            icon="sym_o_arrow_downward"
            @click="moveRowDown"
            :loading="loading"
          >
            <q-tooltip v-if="!$q.platform.is.mobile">Move Down</q-tooltip>
          </q-btn>
        </q-btn-group>
        <q-space></q-space>
        <q-select
          v-model="profile.visibleColumns"
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
          @update:model-value="profile.updateProfile"
        />
      </template>

      <template #body="props">
        <q-tr :props="props">
          <q-radio
            v-model="currentRadio"
            :key="props.rowIndex"
            :val="props.rowIndex"
            @update:model-value="(val) => selectRow(val)"
          />
          <q-td key="set_number" :props="props">
            {{ '#' + props.row.set_number }}
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
                max="9999"
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
                max="999"
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
                max="9999"
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
                max="999"
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
          <q-td key="note" :props="props" class="cursor-pointer" width="20%">
            {{ props.row.note }}
            <q-popup-edit
              v-if="!$q.fullscreen.isActive || !$q.platform.is.mobile"
              v-model="props.row.note"
              auto-save
              :validate="noteValidation"
              @hide="noteValidation"
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

  <DbErrorDialog v-model="displayDbErrorDialog"></DbErrorDialog>
</template>

<style>
.q-dialog__backdrop.fixed-full {
  backdrop-filter: blur(3px);
}
</style>
