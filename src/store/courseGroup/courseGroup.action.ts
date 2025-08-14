import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { $apiPrivate } from "src/consts/api";
import { CustomApiError, Course, Level, Language, CreateGroupForm, Group, UpdateGroupForm, Teacher } from "src/consts/types";


export const getCourses = createAsyncThunk<
  Course[],
  void,
  { rejectValue: string }
>(
  "courseGroup/getCourses",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await $apiPrivate.get<Course[]>("/courses/");
      return data;
    } catch (err) {
      if (axios.isAxiosError<CustomApiError>(err)) {
        return rejectWithValue(err.response?.data.detail || "Не удалось загрузить курсы");
      }
      return rejectWithValue("Неизвестная ошибка");
    }
  }
);


export const getLevels = createAsyncThunk<
  Level[],
  void,
  { rejectValue: string }
>(
  "courseGroup/getLevels",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await $apiPrivate.get<Level[]>("/levels/");
      return data;
    } catch (err) {
      if (axios.isAxiosError<CustomApiError>(err)) {
        return rejectWithValue(err.response?.data.detail || "Не удалось загрузить уровни");
      }
      return rejectWithValue("Неизвестная ошибка");
    }
  }
);


export const getLanguages = createAsyncThunk<
  Language[],
  void,
  { rejectValue: string }
>(
  "courseGroup/getLanguages",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await $apiPrivate.get<Language[]>("/languages/");
      return data;
    } catch (err) {
      if (axios.isAxiosError<CustomApiError>(err)) {
        return rejectWithValue(err.response?.data.detail || "Не удалось загрузить языки");
      }
      return rejectWithValue("Неизвестная ошибка");
    }
  }
);


export const createCourse = createAsyncThunk<
  Course,
  {
    name: string;
    price: number;
    language_name: string;
    level_code: string;
    description: string;
  },
  { rejectValue: string }
>(
  "courseGroup/createCourse",
  async (courseData, { rejectWithValue }) => {
    try {
      const { data } = await $apiPrivate.post<Course>("/courses/", courseData);
      return data;
    } catch (err) {
      if (axios.isAxiosError<CustomApiError>(err)) {
        return rejectWithValue(err.response?.data.detail || "Не удалось создать курс");
      }
      return rejectWithValue("Неизвестная ошибка");
    }
  }
);


export const updateCourse = createAsyncThunk<
  Course,
  {
    id: number;
    name: string;
    price: number;
    language_id: string | number;
    level_id: string | number;
    description: string | null;
  },
  { rejectValue: string }
>(
  "courseGroup/updateCourse",
  async ({ id, ...courseData }, { rejectWithValue }) => {
    try {
      const { data } = await $apiPrivate.patch<Course>(`/courses/${id}`, courseData);
      return data;
    } catch (err) {
      if (axios.isAxiosError<CustomApiError>(err)) {
        return rejectWithValue(err.response?.data.detail || "Не удалось обновить курс");
      }
      return rejectWithValue("Неизвестная ошибка");
    }
  }
);


export const deleteCourse = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>(
  "courseGroup/deleteCourse",
  async (courseId, { rejectWithValue }) => {
    try {
      await $apiPrivate.delete(`/courses/${courseId}`);
      return courseId;
    } catch (err) {
      if (axios.isAxiosError<CustomApiError>(err)) {
        return rejectWithValue(err.response?.data.detail || "Не удалось удалить курс");
      }
      return rejectWithValue("Неизвестная ошибка");
    }
  }
);


export const getCourse = createAsyncThunk<
  Course,
  number,
  { rejectValue: string }
>(
  "courseGroup/getCourse",
  async (courseId, { rejectWithValue }) => {
    try {
      const { data } = await $apiPrivate.get<Course>(`/courses/${courseId}`);
      return data;
    } catch (err) {
      if (axios.isAxiosError<CustomApiError>(err)) {
        return rejectWithValue(err.response?.data.detail || "Не удалось загрузить курс");
      }
      return rejectWithValue("Неизвестная ошибка");
    }
  }
);


export const createLanguage = createAsyncThunk<
  Language,
  { name: string },
  { rejectValue: string }
>(
  "courseGroup/createLanguage",
  async (languageData, { rejectWithValue }) => {
    try {
      const { data } = await $apiPrivate.post<Language>("/languages/", languageData);
      return data;
    } catch (err) {
      if (axios.isAxiosError<CustomApiError>(err)) {
        return rejectWithValue(err.response?.data.detail || "Не удалось создать язык");
      }
      return rejectWithValue("Неизвестная ошибка");
    }
  }
);

export const createLevel = createAsyncThunk<
  Level,
  { code: string; description?: string },
  { rejectValue: string }
>(
  "courseGroup/createLevel",
  async (levelData, { rejectWithValue }) => {
    try {
      const { data } = await $apiPrivate.post<Level>("/levels/", levelData);
      return data;
    } catch (err) {
      if (axios.isAxiosError<CustomApiError>(err)) {
        return rejectWithValue(err.response?.data.detail || "Не удалось создать уровень");
      }
      return rejectWithValue("Неизвестная ошибка");
    }
  }
);
export const getGroups = createAsyncThunk<
  Group[],
  { limit?: number; offset?: number },
  { rejectValue: string }
>(
  "courseGroup/getGroups",
  async ({ limit = 10, offset = 0 }, { rejectWithValue }) => {
    try {
      const { data } = await $apiPrivate.get<Group[]>(`/group/?limit=${limit}&offset=${offset}`);
      return data;
    } catch (err) {
      if (axios.isAxiosError<CustomApiError>(err)) {
        return rejectWithValue(err.response?.data.detail || "Не удалось загрузить группы");
      }
      return rejectWithValue("Неизвестная ошибка");
    }
  }
);

export const getGroup = createAsyncThunk<
  Group,
  number,
  { rejectValue: string }
>(
  "courseGroup/getGroup",
  async (groupId, { rejectWithValue }) => {
    try {
      const { data } = await $apiPrivate.get<Group>(`/group/${groupId}`);
      return data;
    } catch (err) {
      if (axios.isAxiosError<CustomApiError>(err)) {
        if (err.response?.status === 404) return rejectWithValue("Группа не найдена");
        return rejectWithValue(err.response?.data.detail || "Не удалось загрузить группу");
      }
      return rejectWithValue("Неизвестная ошибка");
    }
  }
);

export const createGroup = createAsyncThunk<
  Group,
  CreateGroupForm,
  { rejectValue: string }
>(
  "courseGroup/createGroup",
  async (groupData, { rejectWithValue }) => {
    try {
      const { data } = await $apiPrivate.post<Group>("/group/", groupData);
      return data;
    } catch (err) {
      if (axios.isAxiosError<CustomApiError>(err)) {
        return rejectWithValue(err.response?.data.detail || "Не удалось создать группу");
      }
      return rejectWithValue("Неизвестная ошибка");
    }
  }
);

export const updateGroup = createAsyncThunk<
  Group,
  { id: number; updateData: Partial<UpdateGroupForm> },
  { rejectValue: string }
>(
  "courseGroup/updateGroup",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const { data } = await $apiPrivate.patch<Group>(`/group/${id}`, updateData);
      return data;
    } catch (err) {
      if (axios.isAxiosError<CustomApiError>(err)) {
        if (err.response?.status === 404) return rejectWithValue("Группа не найдена");
        return rejectWithValue(err.response?.data.detail || "Не удалось обновить группу");
      }
      return rejectWithValue("Неизвестная ошибка");
    }
  }
);

export const deleteGroup = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>(
  "courseGroup/deleteGroup",
  async (groupId, { rejectWithValue }) => {
    try {
      await $apiPrivate.delete(`/group/${groupId}`);
      return groupId;
    } catch (err) {
      if (axios.isAxiosError<CustomApiError>(err)) {
        if (err.response?.status === 404) return rejectWithValue("Группа не найдена");
        return rejectWithValue(err.response?.data.detail || "Не удалось удалить группу");
      }
      return rejectWithValue("Неизвестная ошибка");
    }
  }
);

export const getTeachers = createAsyncThunk<
  Teacher[],
  { limit?: number; offset?: number },
  { rejectValue: string }
>(
  "courseGroup/getTeachers",
  async ({ limit = 50, offset = 0 }, { rejectWithValue }) => {
    try {
      const { data } = await $apiPrivate.get<Teacher[]>(`/user/?limit=${limit}&offset=${offset}&role__in=teacher`);
      return data;
    } catch (err) {
      if (axios.isAxiosError<CustomApiError>(err)) {
        return rejectWithValue(err.response?.data.detail || "Не удалось загрузить преподавателей");
      }
      return rejectWithValue("Неизвестная ошибка");
    }
  }
);

