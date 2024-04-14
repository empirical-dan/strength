import { supabase } from 'src/supabase/supabase';
import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import { useAuthStore } from 'src/stores/auth';
import { Profile } from 'src/types/Profile';
import { VisibleColumn } from 'src/types/VisibleColumn';

export const useProfileStore = defineStore('profile', () => {
  const auth = useAuthStore();

  // this is the default profile for new users:
  const data = ref<Profile>({
    id: auth.userId ?? '',
    first_name: '',
    last_name: '',
    show_target_fields: true,
    current_exercise: 212,
    current_set: -1,
  });
  // these are the default visible columns for new users
  const visibleColumns = ref<VisibleColumn[]>([
    'target_weight',
    'target_reps',
    'target_rpe',
    'e1rm',
    'percentage_max',
    'note',
  ]);

  async function checkProfileExists(id: string) {
    // check if logged in but don't want to return that there is no profile if
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', id)
      .maybeSingle();
    if (error) {
      console.log(error);
    }
    if (data?.id === id) {
      return true;
    } else return false;
  }

  async function updateProfile() {
    // check if logged in with an active session
    auth.getSession();
    if (auth.userId === null) return;
    data.value.id = auth.userId;
    console.log('Updating profile for user:');
    console.log(data.value);
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(data.value)
      .select();
    if (profileError) {
      console.log(profileError);
      return;
    }

    const { error: deleteError } = await supabase
      .from('visible_columns')
      .delete()
      .eq('user_id', data.value.id);
    if (deleteError) {
      console.log(deleteError);
      return;
    }
    console.log('Updating visible columns in profile to:');
    console.log(visibleColumns.value);
    const columns = visibleColumns.value.map((column) => {
      return {
        user_id: data.value.id,
        name: column,
      };
    });
    if (columns.length > 0) {
      const { error: insertError } = await supabase
        .from('visible_columns')
        .insert(columns);
      if (insertError) {
        console.log(insertError);
        return;
      }
    }
  }

  async function loadProfile() {
    // check if logged in with an active session
    auth.getSession();
    if (auth.userId === null) return;
    data.value.id = auth.userId;
    // profile data is stored in a single row with primary key of the userId
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select()
      .eq('id', data.value.id)
      .single();
    console.log('Profile data:');
    console.log(profileData);
    if (profileData !== null) {
      // Default profile values are currently all true.
      // If this does not remain the case would need to do a check for null rather than use a ternary
      data.value = profileData;
    } else console.log(profileError);
    // visible columns table has many-to-one relationship
    // i.e. can be more than one visible column per user
    // therefore the user_id column is not the primary key as it is not unique
    // we want to retrieve all the visible columns
    const { data: columnData, error: columnError } = await supabase
      .from('visible_columns')
      .select()
      .eq('user_id', data.value.id);
    console.log(columnError);
    if (columnError || columnData === null) {
      visibleColumns.value = [];
    } else {
      visibleColumns.value = columnData.map((column) => column.name);
    }
  }

  return {
    data,
    visibleColumns,
    checkProfileExists,
    updateProfile,
    loadProfile,
  };
});
