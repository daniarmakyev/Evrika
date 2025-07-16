import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { $apiPrivate } from "src/consts/api";
import { ScheduleType } from "src/consts/types";

export const getShedule = createAsyncThunk<
  ScheduleType,
  void,
  { rejectValue: string }
>(
  "shedule/getShedule",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await $apiPrivate.get<ScheduleType>("/shedule/my");
      return data;
    } catch (err) {
      if (axios.isAxiosError<ApiError>(err)) {
        return rejectWithValue(err.response?.data.message || "Не удалось загрузить расписание");
      }
      return rejectWithValue("Неизвестная ошибка");
    }
  }
);