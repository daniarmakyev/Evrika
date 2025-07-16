import { StudentGroupType, StudentType } from "src/consts/types";
import { getGroup, getStudent } from "./student.action";
import { createSlice } from "@reduxjs/toolkit";

interface StudentState {
  error: string | null;
  loading: boolean;
  student: StudentType | null;
  groups: StudentGroupType[] | null
}

const INIT_STATE: StudentState = {
  error: null,
  loading: false,
  student: null,
  groups: null
};

export const studentSlice = createSlice({
  name: "student",
  initialState: INIT_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStudent.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.student = payload;
        state.error = null;
      })
      .addCase(getStudent.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload || "Failed to get student";
        state.student = null;
      }).addCase(getGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGroup.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.groups = payload;
        state.error = null;
      })
      .addCase(getGroup.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload || "Failed to get group";
        state.groups = null;
      });
  },
});