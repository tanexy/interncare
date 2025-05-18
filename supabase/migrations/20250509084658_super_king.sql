/*
  # Initial Schema Setup

  1. New Tables
    - users
      - id (uuid, primary key)
      - email (text, unique)
      - created_at (timestamp)
    
    - tasks
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - title (text)
      - description (text)
      - priority (text)
      - due_date (timestamp)
      - completed (boolean)
      - time_block_start (timestamp)
      - time_block_end (timestamp)
      - tags (text[])
      - created_at (timestamp)
    
    - mood_entries
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - score (integer)
      - notes (text)
      - factors (text[])
      - created_at (timestamp)
    
    - health_data
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - sleep_hours (numeric)
      - stress_level (integer)
      - water_intake (integer)
      - exercise_minutes (integer)
      - exercise_type (text)
      - meals_breakfast (boolean)
      - meals_lunch (boolean)
      - meals_dinner (boolean)
      - meals_snacks (integer)
      - notes (text)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Tasks table
CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  priority text NOT NULL,
  due_date timestamptz,
  completed boolean DEFAULT false,
  time_block_start timestamptz,
  time_block_end timestamptz,
  tags text[],
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own tasks"
  ON tasks
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Mood entries table
CREATE TABLE mood_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  score integer NOT NULL,
  notes text,
  factors text[],
  created_at timestamptz DEFAULT now()
);

ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own mood entries"
  ON mood_entries
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Health data table
CREATE TABLE health_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  sleep_hours numeric NOT NULL,
  stress_level integer NOT NULL,
  water_intake integer NOT NULL,
  exercise_minutes integer,
  exercise_type text,
  meals_breakfast boolean,
  meals_lunch boolean,
  meals_dinner boolean,
  meals_snacks integer,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE health_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own health data"
  ON health_data
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);