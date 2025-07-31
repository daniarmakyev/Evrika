export type DayCode = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";



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
  group: {
    id: number | string;
    name: string;
  };
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
  review: {
    id: number;
    comment: string;
  } | null;
}

export interface GroupType {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  approximate_lesson_start: string;
  is_active: boolean;
  student_count: number;
}

export interface PaginationType {
  current_page_size: number;
  current_page: number;
  total_pages: number;
}

export interface GroupResponseType {
  groups: GroupType[];
  pagination: PaginationType;
}

export type GroupDetail = {
  id: number;
  name: string;
  created_at: string;
  start_date: string;
  end_date: string;
  approximate_lesson_start: string;
  is_active: boolean;
  is_archived: boolean;
  course_id: number;
  teacher_id: number;
  teacher: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    role: string;
    password: string | null;
  };
  students: {
    id: number;
    first_name: string;
    last_name: string;
  }[];
};



export interface CustomApiError {
  detail?: string;
}


export type CreateLessonRequest = {
  name: string;
  description: string;
  link?: string;
  day: string;
  lesson_start: string;
  lesson_end: string;
  teacher_id: number;
  classroom_id: number;
  passed?: boolean;
};

export interface Classroom {
  id: number;
  name: string;
  created_at: string;
}


export interface AttendanceType {
  id: number;
  status: "absent" | "attended";
  created_at: string;
  student?: UserType | null;
  lesson_id: number | null | string;
}


export interface AttendanceResponse {
  attendance_groups: AttendanceGroup[];
  pagination: Pagination;
}

export interface AttendanceGroup {
  group: {
    id: number;
    name: string;
  };
  attendance: AttendanceRecord[];
}

export interface AttendanceRecord {
  id: number;
  status: "attended" | "missed" | "excused" | string; // adjust as needed
  created_at: string; // ISO datetime string
  student_id: number;
  lesson: Lesson;
}

export interface Lesson {
  id: number;
  name: string;
  day: string; // e.g., "2025-07-30"
  lesson_start: string; // e.g., "02:07:40.437Z"
  lesson_end: string;
}

export interface Pagination {
  current_page_size: number;
  current_page: number;
  total_pages: number;
}
 export type GetAttendanceStudentParams = {
  user_id: string;
  page?: number;
  size?: number;
};