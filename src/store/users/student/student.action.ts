import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { $apiPrivate } from "src/consts/api";
import { StudentGroupType, StudentType } from "src/consts/types";

interface CustomApiError {
    detail?: string;
}

export const getStudent = createAsyncThunk<
    StudentType,
    void,
    { rejectValue: string }
>(
    "student/getStudent",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await $apiPrivate.get<StudentType>(`/user/profile`);
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
    StudentGroupType[],
    void,
    { rejectValue: string }
>(
    "student/getGroup",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await $apiPrivate.get<StudentGroupType[]>(`/group/?limit=10&offset=0`);
            return data;
        } catch (err) {
            if (axios.isAxiosError<CustomApiError>(err)) {
                return rejectWithValue(err.response?.data.detail || "Ошибка получения групп");
            }
            return rejectWithValue("Неизвестная ошибка!");
        }
    }
);