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
    void,
    { rejectValue: string }
>(
    "user/getGroup",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await $apiPrivate.get<GroupType[]>(`/group/?limit=10&offset=0`);
            return data;
        } catch (err) {
            if (axios.isAxiosError<CustomApiError>(err)) {
                return rejectWithValue(err.response?.data.detail || "Ошибка получения групп");
            }
            return rejectWithValue("Неизвестная ошибка!");
        }
    }
);