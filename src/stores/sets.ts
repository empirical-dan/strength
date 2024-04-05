import { supabase } from 'src/supabase/supabase';
import { defineStore } from 'pinia';
import { ExerciseSet, NewExerciseSet } from 'src/types/ExerciseSet';
import { watch, ref, computed, reactive } from 'vue';
import { useAuthStore } from './auth';

const auth = useAuthStore();

export const useSetsStore = defineStore('sets', () => {
  const data = ref<ExerciseSet[]>([]);

  const rowCount = computed(() => data.value.length);

  async function postSet() {
    const send = {
      workout_id: 61,
      exercise_id: 212,
      set_number: 4,
      target_weight: 4,
      target_reps: 4,
      target_rpe: 4,
      actual_weight: 4,
      actual_reps: 4,
      actual_rpe: 4,
      e1rm: 0,
      percentage_max: 0,
      note: '',
      user_id: '9767c42f-faa5-43f9-b3e3-7b7ade5f464a',
    };
  }

  function isValidWeight(val: number | string | null | undefined) {
    if (
      typeof val != 'number' ||
      (val >= 0 && val < 10000 && val % 0.25 === 0)
    ) {
      return true;
    }
    return false;
  }

  function isValidReps(val: number | string | null | undefined) {
    if (typeof val != 'number' || (val >= 0 && val < 1000 && val % 1 === 0)) {
      return true;
    }
    return false;
  }

  function isValidRpe(val: number | string | null | undefined) {
    if (typeof val != 'number' || (val >= 0 && val <= 10 && val % 0.5 === 0)) {
      return true;
    }
    return false;
  }

  function isValidNotes(val: number | string | null | undefined) {
    if (typeof val != 'string' || val.length <= 100) {
      return true;
    }
    return false;
  }

  function isValidSet(set: ExerciseSet) {
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

  function calculateE1rm(rowId: number) {
    if (data.value[rowId] === undefined) {
      return;
    }
    const weight = data.value[rowId].actual_weight;

    if (typeof weight !== 'number') {
      return null;
    } else if (weight >= 10000 || weight <= 0) {
      return 0;
    } else {
      const percentageMax = calculatePercentageMax(rowId);
      if (typeof percentageMax !== 'number') return null;
      else return weight / (percentageMax / 100.0);
    }
  }

  function calculatePercentageMax(rowId: number) {
    if (data.value[rowId] === undefined) {
      return;
    }
    const reps = data.value[rowId].actual_reps;
    const rpe = data.value[rowId].actual_rpe;
    if (typeof reps !== 'number' || typeof rpe !== 'number') {
      return null;
    } else if (rpe < 0 || rpe > 10 || reps < 1 || reps >= 100) {
      return 0;
    } else {
      const maxReps = reps + (10 - rpe);
      return 146.73 - 27.25 * Math.log(maxReps + 4.5);
    }
  }

  async function copyTargetValues(rowId: number) {
    if (data.value[rowId] === undefined) {
      return false;
    }
    // make a non-referenced (i.e. doesn't change the original data) copy
    const updatedSet = { ...data.value[rowId] };
    // 1st update this cloned set's values:
    updatedSet.actual_weight = updatedSet.target_weight;
    updatedSet.actual_reps = updatedSet.target_reps;
    updatedSet.actual_rpe = updatedSet.target_rpe;
    // then try to asynchronously push this to the database
    // i.e. function execution will suspend until the await is resolved
    console.log(updatedSet);
    const { error } = await supabase
      .from('sets')
      .update(updatedSet)
      .eq('id', updatedSet.id);
    console.log('Copying values to DB...');
    console.log(error);
    // only then if the database was successfully updated
    // update the frontend data in this sets store
    if (!error) {
      // if you try and replace the sets store data array object with a copy of the updatedSet
      // the reactivity doesn't work
      data.value[rowId].actual_weight = data.value[rowId].target_weight;
      data.value[rowId].actual_reps = data.value[rowId].target_reps;
      data.value[rowId].actual_rpe = data.value[rowId].target_rpe;
      return true;
    } else return false;
  }

  async function addSet(rowId: number, copy?: boolean) {
    if (auth.userId === null) {
      console.log('Unauthorised to add set');
      return { success: false, row: rowId };
    }
    //make a copy of the sets store
    const updatedSets = <ExerciseSet[]>[...data.value];
    // Try all operations on the cloned updatedSets first:
    // rowId is not the same as the database "id". rowId is the array index of the row
    let newRowId: number;
    if (rowId >= rowCount.value || rowId < 0) {
      newRowId = 0;
    } else {
      newRowId = rowId + 1;
    }
    // rows ids are numbered from 0, sets are numbered from 1 for readability
    // this will work even if there are no sets because rowId will be -1:
    // if no rows are selected it will result in a new row being inserted at the top
    console.log('Adding new row index: ' + newRowId);
    // need to renumber rows:
    // for every set from the position of newRowId
    // advance the rowId by 1:

    for (let idx = newRowId; idx < rowCount.value; idx++) {
      updatedSets[idx].set_number++;
    }

    let newRow: ExerciseSet;

    if (copy === true && rowCount.value >= 1) {
      console.log('Copy set');
      newRow = { ...updatedSets[rowId] };
      console.log('Set copied: ');
      console.log(newRow);
      newRow.set_number = newRowId + 1;
    } else {
      console.log('Adding empty row...');
      newRow = {
        id: -1,
        set_number: newRowId + 1,
        workout_id: 1,
        exercise_id: 212,
        user_id: auth.userId,
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

    // try to insert new set into the database:
    const { id: _, ...setToInsert } = newRow;
    const { data: insertData, error: insertError } = await supabase
      .from('sets')
      .insert(setToInsert)
      .select();
    if (insertError) return { success: false, row: rowId };
    // on successful insert, update the new row with the id generated by the database
    newRow.id = insertData[0].id;

    if (rowCount.value === 0) {
      // if there were previously no sets:
      data.value[0] = { ...newRow };
      return { success: true, row: 0 };
    }

    // try to update the values in the database for the re-numbered sets:
    const { data: updateData, error: updateError } = await supabase
      .from('sets')
      .upsert(updatedSets);
    if (updateError) {
      // if there is an error at this stage (unlikely as the insert has worked)
      // try to "roll back" by deleting inserted row
      const { error: deleteError } = await supabase
        .from('sets')
        .delete()
        .eq('id', newRow.id);
      if (!deleteError) return { success: false, row: rowId };
      else return { success: false, row: newRowId };
    }
    // if we are at this point, both the insert and updates have worked on the db
    // need to update the values in the store:

    data.value = [
      ...updatedSets.slice(0, newRowId),
      newRow,
      ...updatedSets.slice(newRowId),
    ];
    console.log(updateData);
    return { success: true, row: newRowId };
  }

  // REMOVE SET
  async function removeSet(rowId: number) {
    // take a non-reactive snapshot of the number of sets
    const numSets = rowCount.value;
    // make a static copy of the sets store
    const originalSets = <ExerciseSet[]>[...data.value];
    const updatedSets = <ExerciseSet[]>[...data.value];

    // if trying to remove a non-existent set
    // (should not be possible but this is a guard)
    if (numSets < 1 || numSets <= rowId || rowId < 0) {
      // return gracefully but do nothing as this probably isn't a DB error
      return { success: true, row: rowId };
    }

    if (auth.userId === null) {
      console.log('Unauthorised to remove set');
      return { success: false, row: rowId };
    }
    // make a copy of the set to remove just in case...
    const removedSet = { ...data.value[rowId] };

    console.log('REMOVING SET id=' + rowId);
    console.log(removedSet);
    // first try to remove row from the database:
    const { error: deleteError } = await supabase
      .from('sets')
      .delete()
      .eq('id', data.value[rowId].id);
    if (deleteError) {
      console.log('Failed to delete set from database');
      console.log(deleteError);
      return { success: false, row: rowId };
    }

    // successfully deleted row from database

    // if it was the last row in the database remove it from the sets store and we're done here:
    if (rowCount.value === 1) {
      // delete data.value[0];
      data.value.pop();
      console.log('Successful deletion of last remaining set from database');
      console.log('Set data (should be empty):');
      console.log(data.value);
      return { success: true, row: -1 };
    }
    // remove the set from the copy
    updatedSets.splice(rowId, 1);
    // need to decrement id for each set after the removed row
    for (let idx = rowId; idx < numSets - 1; idx++) {
      updatedSets[idx].set_number--;
    }

    console.log('Updated sets before pushed to database:');
    console.log(updatedSets);

    // try to update set numbers for the remaining database rows
    const { data: updateData, error: updateError } = await supabase
      .from('sets')
      .upsert(updatedSets)
      .select();

    if (updateError) {
      // if there is an error at this stage (unlikely as the delete has worked)
      // try to "roll back" by re-inserting deleted row:
      const { id: _, ...setToInsert } = removedSet;
      const { data: insertData, error: insertError } = await supabase
        .from('sets')
        .insert(setToInsert)
        .select();
      // if we have successfully re-inserted the deleted row
      if (!insertError) {
        // try to update the set numbers again by using the original sets store
        const { data: updateData, error: updateError } = await supabase
          .from('sets')
          .upsert(originalSets)
          .select();
        if (!updateError) {
          return { success: false, row: rowId };
        }
      } else {
        // unlikely event that the db delete has succeeded but the re-numbering has failed
        // and the row re-insert has failed:
        if (rowId === 0 && numSets > 1) {
          return { success: false, row: 0 };
        }
        // return --rowId; // set before removed set. this will be -1 if the last set is removed.
        return { success: false, row: rowId - 1 };
      }
    }

    // finally the database delete and updates (re-numbering) have succeeded
    // now update the sets store

    data.value = updatedSets;
    console.log('REMOVED SET:');
    console.log('Row count in sets store=');
    console.log(rowCount.value);
    // If the top set is removed but there are sets remaining, the set number remains the same
    if (rowId === 0 && numSets > 1) {
      return { success: true, row: 0 };
    }
    // return --rowId; // set before removed set. this will be -1 if the last set is removed.
    return { success: true, row: rowId - 1 };
  }

  function moveSetUp(rowId: number) {
    if (auth.userId === null) {
      console.log('Unauthorised to move set up');
      return rowId;
    }
    const numSets = data.value.length;
    if (numSets < 1 || numSets <= rowId || rowId < 1) {
      return rowId;
    }
    // splice out the selected set
    // decrement its id
    // increment the id of the set above
    // swap places of the two changed sets

    data.value[rowId].set_number--;
    data.value[rowId - 1].set_number++;

    data.value = [
      ...data.value.slice(0, rowId - 1),
      data.value[rowId],
      data.value[rowId - 1],
      ...data.value.slice(rowId + 1),
    ];
    return rowId - 1;
  }

  function moveSetDown(rowId: number) {
    if (auth.userId === null) {
      console.log('Unauthorised to move set down');
      return rowId;
    }
    const numSets = data.value.length;
    if (numSets < 1 || numSets - 1 <= rowId || rowId < 0) {
      return rowId;
    }
    // splice out the selected set
    // decrement its id
    // increment the id of the set above
    // swap places of the two changed sets

    data.value[rowId].set_number++;
    data.value[rowId + 1].set_number--;

    data.value = [
      ...data.value.slice(0, rowId),
      data.value[rowId + 1],
      data.value[rowId],
      ...data.value.slice(rowId + 2),
    ];
    return rowId + 1;
  }

  watch(
    data,
    (newValue, oldValue) => {
      console.log('Sets data changed');
    },
    { deep: true }
  );

  return {
    data,
    rowCount,
    addSet,
    removeSet,
    moveSetUp,
    moveSetDown,
    calculatePercentageMax,
    calculateE1rm,
    copyTargetValues,
    isValidNotes,
    isValidReps,
    isValidRpe,
    isValidSet,
    isValidWeight,
  };
});

// async function addSet(rowId: number, copy?: boolean) {
//   if (auth.userId === null) {
//     console.log('Unauthorised to add set');
//     return { success: false, row: rowId };
//   }

//   const updatedSets = [...data.value];
//   // Try all operations on the cloned udatedSets firts:
//   // rowId is not the same as the database "id". rowId is the array index of the row
//   let newRowId: number;
//   if (rowId >= rowCount.value || rowId < 0) {
//     newRowId = 0;
//   } else {
//     newRowId = rowId + 1;
//   }
//   // rows ids are numbered from 0, sets are numbered from 1 for readability
//   // this will work even if there are no sets because rowId will be -1:
//   // if no rows are selected it will result in a new row being inserted at the top
//   console.log('Adding new row index: ' + newRowId);
//   // need to renumber rows:
//   // for every set from the position of newRowId
//   // advance the rowId by 1:

//   for (let idx = newRowId; idx < rowCount.value; idx++) {
//     data.value[idx].set_number++;
//   }

//   // push this change to the

//   let newRow: ExerciseSet;

//   if (copy === true && rowCount.value >= 1) {
//     console.log('Copy set');
//     newRow = { ...data.value[rowId] };
//     console.log('Set copied: ');
//     console.log(newRow);
//     newRow.set_number = newRowId + 1;
//   } else {
//     console.log('Adding empty row...');
//     newRow = {
//       id: newRowId,
//       set_number: newRowId + 1,
//       workout_id: 1,
//       exercise_id: 212,
//       user_id: auth.userId,
//       target_weight: null,
//       target_reps: null,
//       target_rpe: null,
//       actual_weight: null,
//       actual_reps: null,
//       actual_rpe: null,
//       e1rm: null,
//       percentage_max: null,
//       note: null,
//     };
//   }

//   data.value = [
//     ...data.value.slice(0, newRowId),
//     newRow,
//     ...data.value.slice(newRowId),
//   ];

//   const { data: dbData, error } = await supabase
//     .from('sets')
//     .upsert(data.value)
//     .select();
//   console.log(error);
//   console.log('Added set. New set data:');
//   console.log(dbData);

//   return { success: true, row: newRowId };
// }

// function removeSet(rowId: number): number {
//   if (auth.userId === null) {
//     console.log('Unauthorised to remove set');
//     return rowId;
//   }
//   const numSets = rowCount.value;
//   if (numSets < 1 || numSets <= rowId || rowId < 0) {
//     return rowId;
//   }
//   console.log('REMOVING SET id=' + rowId);
//   console.log(data.value[rowId]);
//   // need to decrement id for each set after the removed row
//   for (let idx = rowId; idx < numSets; idx++) {
//     data.value[idx].set_number--;
//   }

//   const removed = data.value.splice(rowId, 1);
//   console.log('REMOVED SET:');
//   console.log(removed);
//   console.log('Row count in sets store=');
//   console.log(rowCount.value);
//   // If the top set is removed but there are sets remaining, the set number remains the same
//   if (rowId === 0 && numSets > 1) {
//     return 0;
//   }
//   return --rowId; // set before removed set. this will be -1 if the last set is removed.

// }
