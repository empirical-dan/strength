export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      accessory_load: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      base_exercises: {
        Row: {
          exercise_category_id: number | null;
          id: number;
          name: string;
          short_name: string | null;
        };
        Insert: {
          exercise_category_id?: number | null;
          id?: number;
          name: string;
          short_name?: string | null;
        };
        Update: {
          exercise_category_id?: number | null;
          id?: number;
          name?: string;
          short_name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'base_exercises_exercise_category_id_fkey';
            columns: ['exercise_category_id'];
            isOneToOne: false;
            referencedRelation: 'exercise_category';
            referencedColumns: ['id'];
          }
        ];
      };
      body_position: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      exercise: {
        Row: {
          alias: string | null;
          deleted_at: string | null;
          description: string | null;
          exercise_category_id: number | null;
          id: number;
          name: string;
          number: number | null;
          short_name: string | null;
          user_id: string;
          workout_id: number | null;
        };
        Insert: {
          alias?: string | null;
          deleted_at?: string | null;
          description?: string | null;
          exercise_category_id?: number | null;
          id?: number;
          name: string;
          number?: number | null;
          short_name?: string | null;
          user_id: string;
          workout_id?: number | null;
        };
        Update: {
          alias?: string | null;
          deleted_at?: string | null;
          description?: string | null;
          exercise_category_id?: number | null;
          id?: number;
          name?: string;
          number?: number | null;
          short_name?: string | null;
          user_id?: string;
          workout_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'exercise_exercise_category_id_fkey';
            columns: ['exercise_category_id'];
            isOneToOne: false;
            referencedRelation: 'exercise_category';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exercise_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exercise_workout_id_fkey';
            columns: ['workout_id'];
            isOneToOne: false;
            referencedRelation: 'workout';
            referencedColumns: ['id'];
          }
        ];
      };
      exercise_attributes: {
        Row: {
          accessory_load_id: number | null;
          body_position_id: number | null;
          exercise_id: number;
          grip_id: number | null;
          id: number;
          kit_id: number | null;
          load_id: number | null;
          load_position_id: number | null;
          range_id: number | null;
          tempo_id: number | null;
        };
        Insert: {
          accessory_load_id?: number | null;
          body_position_id?: number | null;
          exercise_id: number;
          grip_id?: number | null;
          id?: number;
          kit_id?: number | null;
          load_id?: number | null;
          load_position_id?: number | null;
          range_id?: number | null;
          tempo_id?: number | null;
        };
        Update: {
          accessory_load_id?: number | null;
          body_position_id?: number | null;
          exercise_id?: number;
          grip_id?: number | null;
          id?: number;
          kit_id?: number | null;
          load_id?: number | null;
          load_position_id?: number | null;
          range_id?: number | null;
          tempo_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'exercise_attributes_accessory_load_id_fkey';
            columns: ['accessory_load_id'];
            isOneToOne: false;
            referencedRelation: 'accessory_load';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exercise_attributes_body_position_id_fkey';
            columns: ['body_position_id'];
            isOneToOne: false;
            referencedRelation: 'body_position';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exercise_attributes_exercise_id_fkey';
            columns: ['exercise_id'];
            isOneToOne: false;
            referencedRelation: 'exercise';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exercise_attributes_grip_id_fkey';
            columns: ['grip_id'];
            isOneToOne: false;
            referencedRelation: 'grip';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exercise_attributes_kit_id_fkey';
            columns: ['kit_id'];
            isOneToOne: false;
            referencedRelation: 'kit';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exercise_attributes_load_id_fkey';
            columns: ['load_id'];
            isOneToOne: false;
            referencedRelation: 'load';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exercise_attributes_load_position_id_fkey';
            columns: ['load_position_id'];
            isOneToOne: false;
            referencedRelation: 'load_position';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exercise_attributes_range_id_fkey';
            columns: ['range_id'];
            isOneToOne: false;
            referencedRelation: 'range';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'exercise_attributes_tempo_id_fkey';
            columns: ['tempo_id'];
            isOneToOne: false;
            referencedRelation: 'tempo';
            referencedColumns: ['id'];
          }
        ];
      };
      exercise_category: {
        Row: {
          id: number;
          name: string | null;
        };
        Insert: {
          id?: number;
          name?: string | null;
        };
        Update: {
          id?: number;
          name?: string | null;
        };
        Relationships: [];
      };
      grip: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      kit: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      load: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      load_position: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          current_exercise: number | null;
          current_set: number | null;
          first_name: string | null;
          id: string;
          last_name: string | null;
          show_target_fields: boolean | null;
        };
        Insert: {
          current_exercise?: number | null;
          current_set?: number | null;
          first_name?: string | null;
          id: string;
          last_name?: string | null;
          show_target_fields?: boolean | null;
        };
        Update: {
          current_exercise?: number | null;
          current_set?: number | null;
          first_name?: string | null;
          id?: string;
          last_name?: string | null;
          show_target_fields?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      range: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      rpe_percentage_max: {
        Row: {
          id: number;
          percentage_max: number | null;
          reps: number | null;
          rpe: number | null;
        };
        Insert: {
          id?: number;
          percentage_max?: number | null;
          reps?: number | null;
          rpe?: number | null;
        };
        Update: {
          id?: number;
          percentage_max?: number | null;
          reps?: number | null;
          rpe?: number | null;
        };
        Relationships: [];
      };
      sets: {
        Row: {
          actual_reps: number | null;
          actual_rpe: number | null;
          actual_weight: number | null;
          e1rm: number | null;
          exercise_id: number;
          id: number;
          note: string | null;
          percentage_max: number | null;
          set_number: number;
          target_reps: number | null;
          target_rpe: number | null;
          target_weight: number | null;
          user_id: string;
          workout_id: number | null;
        };
        Insert: {
          actual_reps?: number | null;
          actual_rpe?: number | null;
          actual_weight?: number | null;
          e1rm?: number | null;
          exercise_id: number;
          id?: number;
          note?: string | null;
          percentage_max?: number | null;
          set_number: number;
          target_reps?: number | null;
          target_rpe?: number | null;
          target_weight?: number | null;
          user_id: string;
          workout_id?: number | null;
        };
        Update: {
          actual_reps?: number | null;
          actual_rpe?: number | null;
          actual_weight?: number | null;
          e1rm?: number | null;
          exercise_id?: number;
          id?: number;
          note?: string | null;
          percentage_max?: number | null;
          set_number?: number;
          target_reps?: number | null;
          target_rpe?: number | null;
          target_weight?: number | null;
          user_id?: string;
          workout_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'sets_exercise_id_fkey';
            columns: ['exercise_id'];
            isOneToOne: false;
            referencedRelation: 'exercise';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'sets_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'sets_workout_id_fkey';
            columns: ['workout_id'];
            isOneToOne: false;
            referencedRelation: 'workout';
            referencedColumns: ['id'];
          }
        ];
      };
      sets_old: {
        Row: {
          actual_reps: number | null;
          actual_rpe: number | null;
          actual_weight: number | null;
          e1RM: number | null;
          exercise_id: number;
          id: number;
          note: string | null;
          number: number | null;
          target_reps: number | null;
          target_rpe: number | null;
          target_weight: number | null;
          user_id: number | null;
          workout_id: number | null;
        };
        Insert: {
          actual_reps?: number | null;
          actual_rpe?: number | null;
          actual_weight?: number | null;
          e1RM?: number | null;
          exercise_id: number;
          id?: number;
          note?: string | null;
          number?: number | null;
          target_reps?: number | null;
          target_rpe?: number | null;
          target_weight?: number | null;
          user_id?: number | null;
          workout_id?: number | null;
        };
        Update: {
          actual_reps?: number | null;
          actual_rpe?: number | null;
          actual_weight?: number | null;
          e1RM?: number | null;
          exercise_id?: number;
          id?: number;
          note?: string | null;
          number?: number | null;
          target_reps?: number | null;
          target_rpe?: number | null;
          target_weight?: number | null;
          user_id?: number | null;
          workout_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'sets_exercise_id_fkey';
            columns: ['exercise_id'];
            isOneToOne: false;
            referencedRelation: 'exercise';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'sets_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'sets_workout_id_fkey';
            columns: ['workout_id'];
            isOneToOne: false;
            referencedRelation: 'workout';
            referencedColumns: ['id'];
          }
        ];
      };
      stance: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      tempo: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          created_on: string | null;
          email: string | null;
          first_name: string | null;
          id: number;
          last_name: string | null;
          password: string | null;
          username: string | null;
        };
        Insert: {
          created_on?: string | null;
          email?: string | null;
          first_name?: string | null;
          id?: number;
          last_name?: string | null;
          password?: string | null;
          username?: string | null;
        };
        Update: {
          created_on?: string | null;
          email?: string | null;
          first_name?: string | null;
          id?: number;
          last_name?: string | null;
          password?: string | null;
          username?: string | null;
        };
        Relationships: [];
      };
      visible_columns: {
        Row: {
          id: number;
          name: string | null;
          user_id: string;
        };
        Insert: {
          id?: number;
          name?: string | null;
          user_id: string;
        };
        Update: {
          id?: number;
          name?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'visible_columns_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      workout: {
        Row: {
          deleted_at: string | null;
          id: number;
          modified_at: string | null;
          name: string | null;
          user_id: string;
          workout_date: string | null;
        };
        Insert: {
          deleted_at?: string | null;
          id?: number;
          modified_at?: string | null;
          name?: string | null;
          user_id: string;
          workout_date?: string | null;
        };
        Update: {
          deleted_at?: string | null;
          id?: number;
          modified_at?: string | null;
          name?: string | null;
          user_id?: string;
          workout_date?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'workout_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
      PublicSchema['Views'])
  ? (PublicSchema['Tables'] &
      PublicSchema['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
  ? PublicSchema['Enums'][PublicEnumNameOrOptions]
  : never;
