import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { $apiPrivate } from "src/consts/api";
import { GroupType, UserType } from "src/consts/types";

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
    GroupType[],
    string,
    { rejectValue: string }
>(
    "user/getGroup",
    async (role, { rejectWithValue }) => {
        try {
            let data;
            if (role === "admin" || role === "teacher") {
                const response = await $apiPrivate.get<GroupType[]>(`/group-students/?limit=10&offset=0`);
                data = response.data;
            } else {
                const response = await $apiPrivate.get<GroupType[]>(`/group-students/my`);
                data = response.data;
            }
            return data;
        } catch (err) {
            if (axios.isAxiosError<CustomApiError>(err)) {
                return rejectWithValue(err.response?.data.detail || "Ошибка получения групп");
            }
            return rejectWithValue("Неизвестная ошибка!");
        }
    }
);
