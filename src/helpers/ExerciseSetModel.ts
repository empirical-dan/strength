import { ExerciseSet } from 'src/types/ExerciseSet';
import { Ref } from 'vue';

export function addSet(
  userId: string,
  sets: Ref<ExerciseSet[]>,
  selectedSetId: Ref<number>,
  copy?: boolean
): number {
  const numSets = sets.value.length;
  let newRowId: number;
  if (selectedSetId.value >= numSets || selectedSetId.value < 0) {
    newRowId = 0;
  } else {
    newRowId = selectedSetId.value + 1;
  }
  // rows ids are numbered from 0, sets are numbered from 1 for readability
  // this will work even if there are no sets because rowId will be -1:
  // if no rows are selected it will result in a new row being inserted at the top
  console.log('Adding new row index: ' + newRowId);
  // need to renumber rows:
  // for every set from the position of newRowId
  // advance the rowId by 1:
  for (let idx = newRowId; idx < numSets; idx++) {
    sets.value[idx].set_number++;
  }
  let newRow: ExerciseSet;

  if (copy === true && numSets >= 1) {
    console.log('Copy set');
    newRow = { ...sets.value[selectedSetId.value] };
    console.log('Set copied: ');
    console.log(newRow);
    newRow.set_number = newRowId;
  } else {
    console.log('Adding empty row...');
    newRow = {
      id: newRowId,
      set_number: newRowId,
      workout_id: 1,
      exercise_id: 1,
      user_id: userId,
      target_weight: null,
      target_reps: null,
      target_rpe: null,
      actual_weight: null,
      actual_reps: null,
      actual_rpe: null,
      e1rm: null,
      percentage_max: null,
      note: null,
    };
  }

  sets.value = [
    ...sets.value.slice(0, newRowId),
    newRow,
    ...sets.value.slice(newRowId),
  ];

  return newRowId;
}

export function removeSet(
  sets: Ref<ExerciseSet[]>,
  selectedSetId: Ref<number>
): number {
  const numSets = sets.value.length;
  if (
    numSets < 1 ||
    numSets <= selectedSetId.value ||
    selectedSetId.value < 0
  ) {
    return selectedSetId.value;
  }
  console.log('REMOVING SET id=' + selectedSetId.value);
  console.log(sets.value[selectedSetId.value]);
  // need to decrement id for each set after the removed row
  for (let idx = selectedSetId.value; idx < numSets; idx++) {
    sets.value[idx].set_number--;
  }

  const removed = sets.value.splice(selectedSetId.value, 1);
  console.log('REMOVED SET:');
  console.log(removed);
  // If the top set is removed but there are sets remaining, the set number remains the same
  if (selectedSetId.value === 0 && numSets > 1) {
    return 0;
  }
  return --selectedSetId.value; // set before removed set. this will be -1 if the last set is removed.
}

export function moveSetUp(
  sets: Ref<ExerciseSet[]>,
  selectedSetId: Ref<number>
) {
  const numSets = sets.value.length;
  if (
    numSets < 1 ||
    numSets <= selectedSetId.value ||
    selectedSetId.value < 1
  ) {
    return selectedSetId.value;
  }
  // splice out the selected set
  // decrement its id
  // increment the id of the set above
  // swap places of the two changed sets

  sets.value[selectedSetId.value].set_number--;
  sets.value[selectedSetId.value - 1].set_number++;

  sets.value = [
    ...sets.value.slice(0, selectedSetId.value - 1),
    sets.value[selectedSetId.value],
    sets.value[selectedSetId.value - 1],
    ...sets.value.slice(selectedSetId.value + 1),
  ];
  return selectedSetId.value - 1;
}

export function moveSetDown(
  sets: Ref<ExerciseSet[]>,
  selectedSetId: Ref<number>
) {
  const numSets = sets.value.length;
  if (
    numSets < 1 ||
    numSets - 1 <= selectedSetId.value ||
    selectedSetId.value < 0
  ) {
    return selectedSetId.value;
  }
  // splice out the selected set
  // decrement its id
  // increment the id of the set above
  // swap places of the two changed sets

  sets.value[selectedSetId.value].set_number++;
  sets.value[selectedSetId.value + 1].set_number--;

  sets.value = [
    ...sets.value.slice(0, selectedSetId.value),
    sets.value[selectedSetId.value + 1],
    sets.value[selectedSetId.value],
    ...sets.value.slice(selectedSetId.value + 2),
  ];
  return selectedSetId.value + 1;
}

export function calculatePercentageMax(reps: number, rpe: number): number {
  if (rpe < 0 || rpe > 10 || reps < 1 || reps >= 100) {
    return 0;
  }
  const maxReps = reps + (10 - rpe);
  return 146.73 - 27.25 * Math.log(maxReps + 4.5);
}

export function calculateE1rm(
  reps: number,
  rpe: number,
  weight: number
): number {
  if (rpe < 0 || rpe > 10 || reps < 1 || reps >= 100 || weight <= 0) {
    return 0;
  }
  const percentageMax = calculatePercentageMax(reps, rpe);
  return weight / (percentageMax / 100.0);
}

export function copyTargetValues(set: Ref<ExerciseSet>) {
  set.value.actual_weight = set.value.target_weight;
  set.value.actual_reps = set.value.target_reps;
  set.value.actual_rpe = set.value.target_rpe;
}

export function isValidWeight(val: number | string | null | undefined) {
  if (typeof val != 'number' || (val >= 0 && val < 1000 && val % 0.25 === 0)) {
    return true;
  }
  return false;
}

export function isValidReps(val: number | string | null | undefined) {
  if (typeof val != 'number' || (val >= 0 && val < 100 && val % 1 === 0)) {
    return true;
  }
  return false;
}

export function isValidRpe(val: number | string | null | undefined) {
  if (typeof val != 'number' || (val >= 0 && val <= 10 && val % 0.5 === 0)) {
    return true;
  }
  return false;
}

export function isValidNotes(val: number | string | null | undefined) {
  if (typeof val != 'string' || val.length <= 100) {
    return true;
  }
  return false;
}

export function isValidSet(set: ExerciseSet) {
  if (
    isValidWeight(set.target_weight) &&
    isValidWeight(set.actual_weight) &&
    isValidReps(set.target_reps) &&
    isValidReps(set.actual_reps) &&
    isValidRpe(set.target_rpe) &&
    isValidRpe(set.actual_rpe) &&
    isValidNotes(set.note)
  ) {
    return true;
  } else return false;
}
