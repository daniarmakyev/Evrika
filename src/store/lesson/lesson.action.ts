import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { $apiPrivate } from "src/consts/api";
import { LessonListItem, HomeworkSubmission, CustomApiError, HomeworkTask, CreateLessonRequest, Classroom, LessonShedule, StudentByTeacherResponseType } from "src/consts/types";

export const getLessons = createAsyncThunk<
  LessonListItem[],
  number | string,
  { rejectValue: string }
>(
  "lesson/getLessons",
  async (groupId, { rejectWithValue }) => {
    try {
      const { data } = await $apiPrivate.get<LessonListItem[]>(`/lessons/group/${groupId}/lessons?limit=20&offset=0`);
      return data;
    } catch (err) {
      if (axios.isAxiosError<CustomApiError>(err)) {
        if (err.response?.status === 404) return rejectWithValue("");
        return rejectWithValue(err.response?.data.detail || "Ошибка получения уроков");
      }
      return rejectWithValue("Неизвестная ошибка!");
    }
  }
);

export const createLesson = createAsyncThunk<
  void,
  { groupId: number; body: CreateLessonRequest },
  { rejectValue: string }
>(
  "lesson/createLesson",
  async ({ groupId, body }, { rejectWithValue, dispatch }) => {
    try {
      const formatTime = (time: string) => {
        if (time.includes('Z') || time.includes(':') && time.split(':').length === 3) {
          return time;
        }
        return `${time}:00`;
      };

      const formattedBody = {
        ...body,
        lesson_start: formatTime(body.lesson_start),
        lesson_end: formatTime(body.lesson_end),
        passed: body.passed || false
      };

      await $apiPrivate.post(
        `/lessons/group/${groupId}`,
        formattedBody
      );
      dispatch(getLessons(groupId));
    } catch (err) {
      if (axios.isAxiosError<CustomApiError>(err)) {
        return rejectWithValue(err.response?.data.detail || "Ошибка при создании урока");
      }
      return rejectWithValue("Неизвестная ошибка!");
    }
  }
);

export const editLesson = createAsyncThunk<
  void,
  { lesson: LessonShedule; groupId: number | string; body: CreateLessonRequest },
  { rejectValue: string }
>(
  "lesson/editLesson",
  async ({ lesson, groupId, body }, { rejectWithValue, dispatch }) => {
    try {
      const formatTime = (time: string) => {
        if (time.includes('Z') || time.includes(':') && time.split(':').length === 3) {
          return time;
        }
        return `${time}:00`;
      };

      const formattedBody = {
        ...body,
        lesson_start: formatTime(body.lesson_start),
        lesson_end: formatTime(body.lesson_end),
        passed: body.passed || false
      };

      await $apiPrivate.patch(
        `/lessons/${lesson.id}`,
        formattedBody
      );
      dispatch(getLessons(groupId));
    } catch (err) {
      if (axios.isAxiosError<CustomApiError>(err)) {
        return rejectWithValue(err.response?.data.detail || "Ошибка при изменении урока");
      }
      return rejectWithValue("Неизвестная ошибка!");
    }
  }
);


export const deleteLesson = createAsyncThunk<
  void,
  number | string,
  { rejectValue: string }
>(
  "lesson/deleteLesson",
  async (lessonId, { rejectWithValue }) => {
    try {
      await $apiPrivate.delete(`/lessons/${lessonId}`);
    } catch (err) {
      if (axios.isAxiosError<CustomApiError>(err)) {
        if (err.response?.status === 404) return rejectWithValue("");
        return rejectWithValue(err.response?.data.detail || "Ошибка удаления урока");
      }
      return rejectWithValue("Неизвестная ошибка!");
    }
  }
);

export const getHomeworkSubmissions = createAsyncThunk<
  HomeworkSubmission[],
  number,
  { rejectValue: string }
>(
  "lesson/getHomeworkSubmissions",
  async (homework_id, { rejectWithValue }) => {
    try {
      const response = await $apiPrivate.get<HomeworkSubmission[] | HomeworkSubmission>(
        `/submissions/homework/${homework_id}/my_submission`
      );

      const data = response.data;
      return Array.isArray(data) ? data : [data];
    } catch (err) {
      if (axios.isAxiosError<CustomApiError>(err)) {
        const status = err.response?.status;
        if (status === 404 || status === 403 || status === 500) {
          return rejectWithValue("");
        }
        return rejectWithValue(err.response?.data.detail || "");
      }
      return rejectWithValue("Неизвестная ошибка");
    }
  }
);

export const submitHomeworkSubmission = createAsyncThunk<
  HomeworkSubmission,
  { homework_id: number; content: string; file?: File | null },
  { rejectValue: string }
>(
  "lesson/submitHomeworkSubmission",
  async ({ homework_id, content, file }, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append("homework_id", String(homework_id));
      formData.append("content", content || "");
      if (file) {
        formData.append("file", file);
      }

      const { data } = await $apiPrivate.post<HomeworkSubmission>(
        `/submissions/homework/${homework_id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      dispatch(getHomeworkSubmissions(homework_id));
      return data;
    } catch (err) {
      if (axios.isAxiosError<CustomApiError>(err)) {
        if (err.response?.status === 404) return rejectWithValue("");
        return rejectWithValue(
          err.response?.data.detail || "Не удалось отправить домашнее задание"
        );
      }
      return rejectWithValue("Неизвестная ошибка");
    }
  }
);

export const updateHomeworkSubmission = createAsyncThunk<
  HomeworkSubmission,
  {
    submission_id: number;
    content: string;
    file?: File | null;
    removeFile?: boolean;
  },
  { rejectValue: string }
>(
  "lesson/updateHomeworkSubmission",
  async ({ submission_id, content, file, removeFile }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("content", content || "Пусто");
      if (removeFile) {
        formData.append("file", new Blob());
      } else if (file) {
        formData.append("file", file);
      }
      const { data } = await $apiPrivate.patch<HomeworkSubmission>(
        `/submissions/${submission_id}?content=${encodeURIComponent(content || "Пусто")}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return data;
    } catch (err) {
      if (axios.isAxiosError<CustomApiError>(err)) {
        if (err.response?.status === 404) return rejectWithValue("");
        return rejectWithValue(err.response?.data.detail || "Не удалось обновить домашнее задание");
      }
      return rejectWithValue("Неизвестная ошибка");
    }
  }
);

export const deleteHomeworkSubmission = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>(
  "lesson/deleteHomeworkSubmission",
  async (submission_id, { rejectWithValue }) => {
    try {
      await $apiPrivate.delete(`/submissions/${submission_id}`);
      return submission_id;
    } catch (err) {
      if (axios.isAxiosError<CustomApiError>(err)) {
        if (err.response?.status === 404) return rejectWithValue("Домашнее задание не найдено");
        return rejectWithValue(err.response?.data.detail || "Не удалось удалить домашнее задание");
      }
      return rejectWithValue("Неизвестная ошибка");
    }
  }
);

export const getHomeworkWithSubmissions = createAsyncThunk<
  { homework: HomeworkTask; submissions: HomeworkSubmission[] },
  number,
  { rejectValue: string }
>(
  "lesson/getHomeworkWithSubmissions",
  async (homeworkId, { rejectWithValue }) => {
    try {
      const { data } = await $apiPrivate.get<{
        id: number;
        created_at: string;
        deadline: string;
        file_path: string | null;
        description: string;
        lesson_id: number;
        submissions: HomeworkSubmission[];
      }>(`/homeworks/${homeworkId}`);
      return {
        homework: {
          id: data.id,
          deadline: data.deadline,
          description: data.description,
          file_path: data.file_path,
        },
        submissions: data.submissions,
      };
    } catch (err) {
      if (axios.isAxiosError<CustomApiError>(err)) {
        return rejectWithValue(err.response?.data.detail || "Ошибка получения домашнего задания");
      }
      return rejectWithValue("Неизвестная ошибка!");
    }
  }
);

export const updateHomeworkAssignment = createAsyncThunk<
  HomeworkTask,
  {
    id: number;
    description: string;
    deadline: string;
    file?: File | null;
    removeFile?: boolean;
  },
  { rejectValue: string }
>(
  "lesson/updateHomeworkAssignment",
  async ({ id, description, deadline, file, removeFile }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("description", description || "");
      formData.append("deadline", deadline);
      if (removeFile) {
        formData.append("file", new Blob());
      } else if (file) {
        formData.append("file", file);
      }
      const { data } = await $apiPrivate.patch<HomeworkTask>(
        `/homeworks/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return data;
    } catch (err) {
      if (axios.isAxiosError<CustomApiError>(err)) {
        return rejectWithValue(err.response?.data.detail || "Не удалось обновить домашнее задание");
      }
      return rejectWithValue("Неизвестная ошибка");
    }
  }
);

export const createHomeworkAssignment = createAsyncThunk<
  HomeworkTask & { submissions: HomeworkSubmission[] },
  {
    description: string;
    deadline: string;
    lesson_id: number;
    file?: File | null;
  },
  { rejectValue: string }
>(
  "lesson/createHomeworkAssignment",
  async ({ description, deadline, lesson_id, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("description", description || "");
      formData.append("deadline", deadline);
      if (file) {
        formData.append("file", file);
      }
      const { data } = await $apiPrivate.post<HomeworkTask & { submissions: HomeworkSubmission[] }>(
        `/homeworks/lesson/${lesson_id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return data;
    } catch (err) {
      if (axios.isAxiosError<CustomApiError>(err)) {
        return rejectWithValue(err.response?.data.detail || "Не удалось создать домашнее задание");
      }
      return rejectWithValue("Неизвестная ошибка");
    }
  }
);

export const deleteHomeworkAssignment = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>(
  "lesson/deleteHomeworkAssignment",
  async (homeworkId, { rejectWithValue }) => {
    try {
      await $apiPrivate.delete(`/homeworks/${homeworkId}`);
      return homeworkId;
    } catch (err) {
      if (axios.isAxiosError<CustomApiError>(err)) {
        if (err.response?.status === 404) return rejectWithValue("Домашнее задание не найдено");
        return rejectWithValue(err.response?.data.detail || "Не удалось удалить домашнее задание");
      }
      return rejectWithValue("Неизвестная ошибка");
    }
  }
);

export const getClassrooms = createAsyncThunk<
  Classroom[],
  void,
  { rejectValue: string }
>(
  "lesson/getClassrooms",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await $apiPrivate.get<Classroom[]>(`/classrooms/`);
      return data;
    } catch (err) {
      if (axios.isAxiosError<CustomApiError>(err)) {
        return rejectWithValue(err.response?.data.detail || "Ошибка получения аудиторий");
      }
      return rejectWithValue("Неизвестная ошибка!");
    }
  }
);


export const getStudentHomeWorkByTeacher = createAsyncThunk<
  StudentByTeacherResponseType,
  number | string,
  { rejectValue: string }
>(
  "lesson/getStudentHomeWorkByTeacher",
  async (user_id, { rejectWithValue }) => {
    try {
      const { data } = await $apiPrivate.get<StudentByTeacherResponseType>(`submissions/user/${user_id}?page=1&size=10`);
      return data;
    } catch (err) {
      if (axios.isAxiosError<CustomApiError>(err)) {
        return rejectWithValue(err.response?.data.detail || "Ошибка получения аудиторий");
      }
      return rejectWithValue("Неизвестная ошибка!");
    }
  }
);


export const createHomeworkReview = createAsyncThunk<
  { id: number; submission_id: number; teacher_id: number; comment: string; reviewed_at: string },
  {
    submission_id: number;
    comment: string;
  },
  { rejectValue: string }
>(
  "lesson/createHomeworkReview",
  async ({ submission_id, comment }, { rejectWithValue }) => {
    try {
      const { data } = await $apiPrivate.post<{
        id: number;
        submission_id: number;
        teacher_id: number;
        comment: string;
        reviewed_at: string;
      }>(`/homework_review/submission/${submission_id}`, {
        comment,
      });
      return data;
    } catch (err) {
      if (axios.isAxiosError<CustomApiError>(err)) {
        if (err.response?.status === 404) return rejectWithValue("Домашнее задание не найдено");
        return rejectWithValue(err.response?.data.detail || "Не удалось создать Коментарий");
      }
      return rejectWithValue("Неизвестная ошибка");
    }
  }
);

export const updateHomeworkReview = createAsyncThunk<
  { id: number; submission_id: number; teacher_id: number; comment: string; reviewed_at: string },
  {
    review_id: number;
    comment: string;
  },
  { rejectValue: string }
>(
  "lesson/updateHomeworkReview",
  async ({ review_id, comment }, { rejectWithValue }) => {
    try {
      const { data } = await $apiPrivate.patch<{
        id: number;
        submission_id: number;
        teacher_id: number;
        comment: string;
        reviewed_at: string;
      }>(`/homework_review/${review_id}`, {
        comment,
      });
      return data;
    } catch (err) {
      if (axios.isAxiosError<CustomApiError>(err)) {
        if (err.response?.status === 404) return rejectWithValue("Коментарий не найден");
        return rejectWithValue(err.response?.data.detail || "Не удалось обновить Коментарий");
      }
      return rejectWithValue("Неизвестная ошибка");
    }
  }
);