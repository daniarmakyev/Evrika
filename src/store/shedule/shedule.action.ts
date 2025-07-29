import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { $apiPrivate } from "src/consts/api";
import { CustomApiError, ScheduleType } from "src/consts/types";

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
      if (axios.isAxiosError<CustomApiError>(err)) {
        return rejectWithValue(err.response?.data.detail || "Не удалось загрузить расписание");
      }
      return rejectWithValue("Неизвестная ошибка");
    }
  }
);

