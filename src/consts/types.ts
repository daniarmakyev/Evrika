export type DayCode = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

export interface Classroom {
  id: number;
  name: string;
  created_at?: string;
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

export interface AttendanceType {
  id: number;
  status: "absent" | "attended";
  created_at: string;
  student?: UserType | null;
  lesson_id: number | null | string;
}

export type StudentByTeacherResponseType = {
  items: Array<{
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
  }>;
  pagination: {
    current_page_size: number;
    current_page: number;
    total_pages: number;
  };
};

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
  status: "attended" | "missed" | "excused" | string;
  created_at: string;
  student_id: number;
  lesson: Lesson;
}

export interface Lesson {
  id: number;
  name: string;
  day: string;
  lesson_start: string;
  lesson_end: string;
}

export type GetAttendanceStudentParams = {
  user_id: string | null;
  page?: number;
  size?: number;
};
export type GetStudentsParams = {
  user_id: number | null;
  page?: number;
  size?: number;
};
export type GetHomeworkParams = {
  user_id: number | null | undefined;
  group_id: number | null | undefined;
  page?: number;
  size?: number;
};

export type AuthLoginResponse = {
  access_token: string;
  token_type: string;
};

export interface Course {
  id: number;
  name: string;
  price: number;
  description: string;
  language_id: number;
  level_id: number;
  language_name: string;
  level_code: string;
  created_at: string;
}

export interface CourseTableItem {
  id: number;
  name: string;
  price: number;
  language_name: string;
  level_code: string;
  description: string;
}

export type Level = {
  id: number | string;
  code: string;
  description: string;
};

export type Language = {
  id: number | string;
  name: string;
};

export interface Group {
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
  teacher: Teacher;
  course?: Course;
}

export interface GroupTableItem {
  id: number;
  name: string;
  course_name: string;
  status: string;
  teacher_name: string;
  start_date: string;
}

export interface CreateGroupForm {
  name: string;
  start_date: string;
  end_date: string;
  approximate_lesson_start: string;
  is_active: boolean;
  is_archived: boolean;
  course_id: number;
  teacher_id: number;
}

export interface UpdateGroupForm extends CreateGroupForm {
  id: number;
}

export interface GroupsResponse {
  groups: Group[];
  pagination?: PaginationType;
}

export interface Teacher {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: string;
  password: string | null;
}

export interface FinanceItem {
  student_id: number;
  student_first_name: string;
  student_last_name: string;
  group_id: number;
  payment_detail_id: number;
  months_paid: number;
  current_month_number: number;
  payment_status: string;
  group: Group;
  checks: Check[];
  group_course_name: string;
}

export interface Check {
  id: number;
  check: string;
  student_id: number;
  group_id: number;
  uploaded_at: string;
}

export interface FinanceTableItem {
  id: number;
  student_name: string;
  group_name: string;
  payment_status: string;
  checks: Check[];
  group_id: number;
  student_id: number;
}

export interface FinanceResponse {
  items: FinanceItem[];
  pagination: PaginationType;
}

export type GroupStudent = {
  id: number;
  name: string;
};

export type Student = {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  role: "teacher" | "student" | string; // если роль может быть не только teacher
  is_active: boolean;
  groups: GroupStudent[];
};

export type Pagination = {
  current_page_size: number;
  current_page: number;
  total_pages: number;
};

export type StudentsResponse = {
  students: Student[];
  pagination: Pagination;
};

export type User = {
  id: number | null;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: "teacher" | "student" | "admin";
  password: string;
};

type Teacher2 = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: string;
  password: string;
};

type Student2 = {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  role: string; // хотя тут у тебя указано "teacher", наверное должно быть "student"
  is_active: boolean;
  payment_status: "Оплачено" | "Не оплачено" | string;
};

export type Course2 = {
  id: number;
  name: string;
  created_at: string; // ISO string
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  approximate_lesson_start: string; // время в ISO формате
  is_active: boolean;
  is_archived: boolean;
  course_id: number;
  teacher: Teacher2;
  teacher_id: number;
  students: Student2[];
};

// это твой полный ответ от API
export type CoursesResponse = Course2[];
export interface PaymentDetail {
  id: number;
  student_id: number;
  group_id: number;
  joined_at: string;
  months_paid: number;
  is_active: boolean;
  price: number;
  current_month_number: number;
  deadline: string;
  status: "Оплачено" | "Не оплачено";
  group: {
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
  };
  student: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    role: "teacher" | "student" | "admin";
  };
}
export interface Check {
  id: number;
  check: string;
  student_id: number;
  group_id: number;
  uploaded_at: string;
  group: {
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
  };
  student: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    role: string;
  };
}

export type UpdateStudent = {
  full_name: string;
  email: string;
  phone_number: string;

};



export interface HomeworkItem {
  id: number;
  homework_id: number;
  student_id: number;
  file_path: string;
  content: string;
  submitted_at: string;
  deadline: string;
  group_name: string;
  lesson_name: string;
  review: {
    id: string | number;
    comment: string;
  }
}

export interface HomeworkResponse {
  items: HomeworkItem[];
  pagination: Pagination;
}


