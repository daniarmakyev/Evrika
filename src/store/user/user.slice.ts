import { AttendanceType, GroupDetail, GroupResponseType, UserType } from "src/consts/types";
import { editAttendance, getAttendanceByLesson, getGroup, getGroupById, getUser, getUserById, authLogin, getGroupsTeacher } from "./user.action";
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
  anotherUser: UserType | null;
  isAuthenticated: boolean;
  loginLoading: boolean;
  token: string | null;
  groupsTeacher: GroupResponseType | null;
}

const INIT_STATE: UserState = {
  error: null,
  loading: false,
  attendanceLoading: false,
  groupLoading: false,
  anotherUser: null,
  user: null,
  groups: null,
  groupsLoading: false,
  group: null,
  attendance: null,
  isAuthenticated: false,
  loginLoading: false,
  token: null,
  groupsTeacher: null
};

export const userSlice = createSlice({
  name: "user",
  initialState: INIT_STATE,
  reducers: {
    initializeAuth: (state) => {
      const token = localStorage.getItem("evrika-access-token");
      if (token) {
        state.token = token;
        state.isAuthenticated = true;
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.groups = null;
      state.group = null;
      state.attendance = null;
      localStorage.removeItem("evrika-access-token");
      localStorage.removeItem("role");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authLogin.pending, (state) => {
        state.loginLoading = true;
        state.error = null;
      })
      .addCase(authLogin.fulfilled, (state) => {
        state.loginLoading = false;
        state.isAuthenticated = true;
        state.error = null;
        const token = localStorage.getItem("evrika-access-token");
        state.token = token;
      })
      .addCase(authLogin.rejected, (state, { payload }) => {
        state.loginLoading = false;
        state.error = payload || "Failed to login";
        state.isAuthenticated = false;
        state.token = null;
      })
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
        state.isAuthenticated = false;
        state.token = null;
        localStorage.removeItem("evrika-access-token");
        localStorage.removeItem("role");
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
        state.anotherUser = payload;
        state.error = null;
      })
      .addCase(getUserById.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload || "Failed to get user";
        state.anotherUser = null;
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
      }).addCase(getGroupsTeacher.pending, (state) => {
        state.groupsLoading = true;
        state.error = null;
      })
      .addCase(getGroupsTeacher.fulfilled, (state, { payload }) => {
        state.groupsLoading = false;
        state.groupsTeacher = payload;
        state.error = null;
      })
      .addCase(getGroupsTeacher.rejected, (state, { payload }) => {
        state.groupsLoading = false;
        state.error = payload || "Failed to get group";
        state.groups = null;
      })
  },
});

export const { initializeAuth, logout, clearError } = userSlice.actions;
export default userSlice.reducer;