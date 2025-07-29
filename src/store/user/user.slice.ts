import { AttendanceType, GroupDetail, GroupResponseType, UserType } from "src/consts/types";
import { editAttendance, getAttendanceByLesson, getGroup, getGroupById, getUser, getUserById } from "./user.action";
import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  error: string | null;
  loading: boolean;
  attendanceLoading: boolean;
  user: UserType | null;
  groups: GroupResponseType | null;
  group: GroupDetail | null;
  attendance: AttendanceType[] | null;
  groupsLoading: boolean;
  groupLoading: boolean;
}

const INIT_STATE: UserState = {
  error: null,
  loading: false,
  attendanceLoading: false,
  groupLoading: false,
  user: null,
  groups: null,
  groupsLoading: false,
  group: null,
  attendance: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState: INIT_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload;
        state.error = null;
      })
      .addCase(getUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload || "Failed to get user";
        state.user = null;
      })
      .addCase(getGroup.pending, (state) => {
        state.groupsLoading = true;
        state.error = null;
      })
      .addCase(getGroup.fulfilled, (state, { payload }) => {
        state.groupsLoading = false;
        state.groups = payload;
        state.error = null;
      })
      .addCase(getGroup.rejected, (state, { payload }) => {
        state.groupsLoading = false;
        state.error = payload || "Failed to get group";
        state.groups = null;
      })
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload;
        state.error = null;
      })
      .addCase(getUserById.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload || "Failed to get user";
        state.user = null;
      })
      .addCase(getGroupById.pending, (state) => {
        state.groupLoading = true;
        state.error = null;
      })
      .addCase(getGroupById.fulfilled, (state, { payload }) => {
        state.groupLoading = false;
        state.group = payload;
        state.error = null;
      })
      .addCase(getGroupById.rejected, (state, { payload }) => {
        state.groupLoading = false;
        state.error = payload || "Failed to get group by ID";
        state.group = null;
      })
      .addCase(getAttendanceByLesson.pending, (state) => {
        state.attendanceLoading = true;
        state.error = null;
        state.attendance = null;
      })
      .addCase(getAttendanceByLesson.fulfilled, (state, { payload }) => {
        state.attendanceLoading = false;
        state.attendance = payload;
        state.error = null;
      })
      .addCase(getAttendanceByLesson.rejected, (state, { payload }) => {
        state.attendanceLoading = false;
        state.error = payload || "Failed to get attendance";
        state.attendance = null;
      })
      .addCase(editAttendance.pending, (state) => {
        state.error = null;
      })
      .addCase(editAttendance.fulfilled, (state, { payload }) => {
        state.attendance = state.attendance?.map((att) =>
          att.id === payload.id ? payload : att
        ) || [];
        state.error = null;
      })
      .addCase(editAttendance.rejected, (state, { payload }) => {
        state.error = payload || "Failed to edit attendance";
      });
  },
});

export default userSlice.reducer;