import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { $apiPrivate } from "src/consts/api";
import { AttendanceType, GroupDetail, GroupResponseType, UserType } from "src/consts/types";

interface CustomApiError {
    detail?: string;
}

export const getUser = createAsyncThunk<
    UserType,
    void,
    { rejectValue: string }
>(
    "user/getUser",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await $apiPrivate.get<UserType>(`/user/profile`);
            return data;
        } catch (err) {
            if (axios.isAxiosError<CustomApiError>(err)) {
                return rejectWithValue(err.response?.data.detail || "Ошибка получения студента");
            }
            return rejectWithValue("Неизвестная ошибка!");
        }
    }
);

export const getGroup = createAsyncThunk<
    GroupResponseType,
    string,
    { rejectValue: string }
>(
    "user/getGroup",
    async (role, { rejectWithValue }) => {
        try {
            const { data } = await $apiPrivate.get<GroupResponseType>(`/group/my`);
            return data;
        } catch (err) {
            if (axios.isAxiosError<CustomApiError>(err)) {
                return rejectWithValue(err.response?.data.detail || "Ошибка получения групп");
            }
            return rejectWithValue("Неизвестная ошибка!");
        }
    }
);

export const getGroupById = createAsyncThunk<
    GroupDetail,
    number | string,
    { rejectValue: string }
>(
    "user/getGroupById",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await $apiPrivate.get<GroupDetail>(`group-students/${id}`);
            return data;
        } catch (err) {
            if (axios.isAxiosError<CustomApiError>(err)) {
                return rejectWithValue(err.response?.data.detail || "Ошибка получения группы");
            }
            return rejectWithValue("Неизвестная ошибка!");
        }
    }
);

export const getUserById = createAsyncThunk<
    UserType,
    string | number,
    { rejectValue: string }
>(
    "user/getUserById",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await $apiPrivate.get<UserType>(`/user/${id}`);
            return data;
        } catch (err) {
            if (axios.isAxiosError<CustomApiError>(err)) {
                return rejectWithValue(err.response?.data.detail || "Ошибка получения студента");
            }
            return rejectWithValue("Неизвестная ошибка!");
        }
    }
);

export const getAttendanceByLesson = createAsyncThunk<
    AttendanceType[],
    string,
    { rejectValue: string }
>(
    "user/getAttendanceByLesson",
    async (lesson_id, { rejectWithValue }) => {
        try {
            const { data } = await $apiPrivate.get<AttendanceType[]>(`/attendance/lesson/${lesson_id}`);
            return data;
        } catch (err) {
            if (axios.isAxiosError<CustomApiError>(err)) {
                return rejectWithValue(err.response?.data.detail || "Не удалось загрузить посещаемость");
            }
            return rejectWithValue("Неизвестная ошибка");
        }
    }
);

export const editAttendance = createAsyncThunk<
    AttendanceType,
    {
        attendance_id: number | string, status: {
            status: "attended" | "absent"
        }
    },
    { rejectValue: string }
>(
    "user/editAttendance",
    async ({ attendance_id, status }, { rejectWithValue }) => {
        try {
            const { data } = await $apiPrivate.patch<AttendanceType>(`attendance/${attendance_id}`, status);
            return data;
        } catch (err) {
            if (axios.isAxiosError<CustomApiError>(err)) {
                return rejectWithValue(err.response?.data.detail || "Не удалось загрузить посещаемость");
            }
            return rejectWithValue("Неизвестная ошибка");
        }
    }
);