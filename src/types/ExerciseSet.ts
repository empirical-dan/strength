export type ExerciseSet = {
  id: number;
  workout_id: number;
  exercise_id: number;
  user_id: number;
  target_weight: number | string | null;
  target_reps: number | string | null;
  target_rpe: number | string | null;
  actual_weight: number | string | null;
  actual_reps: number | string | null;
  actual_rpe: number | string | null;
  e1rm: number | null;
  percentage_max: number | null;
  notes: string | null;
};
