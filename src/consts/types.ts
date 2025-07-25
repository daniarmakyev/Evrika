export type DayCode = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

export interface Group {
  id: number;
  name: string;
}

export interface Classroom {
  id: number;
  name: string;
}

export interface Teacher {
  id: number;
  first_name: string;
  last_name: string;
}

export interface LessonShedule {
  id: number;
  name: string;
  description: string;
  link: string;
  day: string;
  lesson_start: string;
  lesson_end: string;
  teacher: Teacher;
  classroom: Classroom;
}

export interface ScheduleEntry {
  group: Group;
  lessons: LessonShedule[];
}

export type ScheduleType = {
  [key in DayCode]: ScheduleEntry[];
};

export interface StudentCourse {
  id: number;
  name: string;
  language_name: string;
  level_code: string;
}

export interface UserType {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  role: "student" | "admin" | "teacher";
  courses: StudentCourse[];
}

export interface HomeworkTask {
  id: number;
  deadline: string;
  description: string;
  file_path: string | null;
}

export interface LessonListItem {
  id: number;
  name: string;
  description: string;
  link: string;
  day: string;
  lesson_start: string;
  lesson_end: string;
  teacher_id: number;
  group_id: number;
  classroom_id: number;
  group_name: string;
  classroom_name: string;
  created_at: string;
  homework?: HomeworkTask;
}

export interface HomeworkSubmission {
  id: number;
  homework_id: number;
  student_id: number;
  file_path: string | null;
  content: string;
  submitted_at: string;
  review: string | null
}

export interface GroupType {
  id: number;
  name: string;
  created_at?: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  is_archived?: boolean;
  course_id?: number;
  teacher?: Teacher;
  teacher_id?: number;
  student_count: number | string;
  students?: Array<{
    id: number;
    first_name: string;
    last_name: string;
  }>;
}

export interface CustomApiError {
  detail?: string;
}
