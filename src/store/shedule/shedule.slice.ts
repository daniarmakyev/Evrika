import { createSlice } from "@reduxjs/toolkit";
import { getShedule } from "./shedule.action";
import { ScheduleType } from "src/consts/types";

interface SheduleState {
  error: string | null;
  loading: boolean;
  shedule: ScheduleType | null; 
}

const INIT_STATE: SheduleState = {
  error: null,
  loading: false,
  shedule: null,
};

export const sheduleSlice = createSlice({
  name: "shedule",
  initialState: INIT_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getShedule.pending, (state) => {
      state.loading = true;
      state.error = null;
    }).addCase(getShedule.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.shedule = payload;
      state.error = null;
    }).addCase(getShedule.rejected, (state) => {
      state.loading = false;
      state.error = "Failed to fetch schedule";
      state.shedule = null;
    });
  },
});
