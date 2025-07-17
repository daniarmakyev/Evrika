import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { $apiPrivate } from "src/consts/api";
import { LessonListItem, HomeworkSubmission, CustomApiError } from "src/consts/types";


export const getLessons = createAsyncThunk<
  LessonListItem[],
  number | string,
  { rejectValue: string }
>(
  "lesson/getLessons",
  async (groupId, { rejectWithValue }) => {
    try {
      const { data } = await $apiPrivate.get<LessonListItem[]>(`/lessons/group/${groupId}/lessons?limit=10&offset=0`);
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

export const getHomeworkSubmissions = createAsyncThunk<
  HomeworkSubmission[],
  number | string,
  { rejectValue: string }
>(
  "lesson/getHomeworkSubmissions",
  async (homeworkId, { rejectWithValue }) => {
    try {
      const { data } = await $apiPrivate.get<HomeworkSubmission[]>(`/submissions/homework/${homeworkId}`);
      return data;
    } catch (err) {
      if (axios.isAxiosError<CustomApiError>(err)) {
        if (err.response?.status === 404) return rejectWithValue("");
        return rejectWithValue(err.response?.data.detail || "Не удалось загрузить уроки");
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
  async ({ homework_id, content, file }, { rejectWithValue }) => {
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
      return data;
    } catch (err) {
      if (axios.isAxiosError<CustomApiError>(err)) {
        if (err.response?.status === 404) return rejectWithValue("");
        return rejectWithValue(err.response?.data.detail || "Не удалось отправить домашнее задание");
      }
      return rejectWithValue("Неизвестная ошибка");
    }
  }
);

export const updateHomeworkSubmission = createAsyncThunk<
  HomeworkSubmission,
  { submission_id: number; content: string; file?: File | Blob | null },
  { rejectValue: string }
>(
  "lesson/updateHomeworkSubmission",
  async ({ submission_id, content, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("content", content || "");
      if (file) {
        formData.append("file", file);
      }

      const { data } = await $apiPrivate.patch<HomeworkSubmission>(
        `/submissions/${submission_id}?content=${content || "empty"}`,
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