import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { $apiPrivate } from "src/consts/api";
import { AttendanceType, AuthLoginResponse, GroupDetail, GroupResponseType, UserType } from "src/consts/types";

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
    { page?: number; size?: number } | void,
    { rejectValue: string }
>(
    "user/getGroup",
    async (args, { rejectWithValue }) => {
        try {
            const page = args?.page;
            const size = args?.size;

            let url = "/group/my";
            if (page !== undefined && size !== undefined) {
                url += `?page=${page}&size=${size}`;
            }

            const { data } = await $apiPrivate.get<GroupResponseType>(url);
            return data;
        } catch (err) {
            if (axios.isAxiosError<CustomApiError>(err)) {
                return rejectWithValue(
                    err.response?.data?.detail || "Ошибка получения групп"
                );
            }
            return rejectWithValue("Неизвестная ошибка!");
        }
    }
);



export const getGroupsTeacher = createAsyncThunk<
    GroupResponseType,
    { page?: number; size?: number } | void,
    { rejectValue: string }
>(
    "user/getGroupsTeacher",
    async (args, { rejectWithValue }) => {
        try {
            const page = args && args.page;
            const size = args && args.size;

            let url = "/group/my";
            if (page !== undefined && size !== undefined) {
                url += `?page=${page}&size=${size}`;
            }

            const { data } = await $apiPrivate.get<GroupResponseType>(url);
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

export const authLogin = createAsyncThunk<
    void,
    { username: string, password: string },
    { rejectValue: string }
>(
    "user/authLogin",
    async ({ username, password }, { rejectWithValue }) => {
        const formData = new FormData();
        if (username && password) {
            formData.append("username", username);
            formData.append("password", password);
        }
        try {
            const { data } = await $apiPrivate.post<AuthLoginResponse>(`/auth/login`, formData);
            if (!data.access_token) {
                return rejectWithValue("Не удалось войти в систему");
            } else {
                localStorage.setItem("evrika-access-token", data.access_token);
            }
        } catch (err) {
            if (axios.isAxiosError<CustomApiError>(err)) {
                if (err.response?.data.detail === "LOGIN_BAD_CREDENTIALS") {
                    return rejectWithValue("Неверные учетные данные");
                } else {
                    return rejectWithValue(err.response?.data.detail || "Не удалось войти в систему");
                }
            }
            return rejectWithValue("Неизвестная ошибка");
        }
    }
);