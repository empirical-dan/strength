import { ExerciseSet } from './ExerciseSet';

export type ExerciseTableColumn = {
  name: string;
  label: string;
  field: string | ((row: ExerciseSet) => string | number);
  required?: boolean;
  align?: 'right' | 'left' | 'center';
  sortable?: boolean;
  sort?: (
    a: string | number,
    b: string | number,
    rowA: ExerciseSet,
    rowB: ExerciseSet
  ) => number;
  rawSort?: (
    a: string | number,
    b: string | number,
    rowA: object,
    rowB: object
  ) => number;
  sortOrder?: 'ad' | 'da';
  format?: (val: string | number, row?: ExerciseSet) => string | number;
  style?: string | ((row: ExerciseSet) => string);
  classes?: string | ((row: ExerciseSet) => string);
  headerStyle?: string;
  headerClasses?: string;
};
