import { GroupType, UserType } from "src/consts/types";
import { getGroup, getUser } from "./user.action";
import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  error: string | null;
  loading: boolean;
  user: UserType | null;
  groups: GroupType[] | null
}

const INIT_STATE: UserState = {
  error: null,
  loading: false,
  user: null,
  groups: null
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