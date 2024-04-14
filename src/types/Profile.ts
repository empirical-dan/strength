export type Profile = {
  id: string; // primary key so can't be null
  first_name: string | null;
  last_name: string | null;
  show_target_fields: boolean | null;
  current_set: number | null;
  current_exercise: number | null;
};
