"use client";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { AttendanceResponse,GetAttendanceStudentParams } from "src/consts/types";
import { API_URL } from "src/consts/api";

export const attendanceApi = createApi({
  reducerPath: "attendanceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("evrika-access-token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    getAttendanceStudent: builder.query<AttendanceResponse, GetAttendanceStudentParams>({
      query: ({ user_id, page = 1, size = 20 }) =>
        `/attendance/student/${user_id}?page=${page}&size=${size}`,
    }),
  }),
});

export const { useGetAttendanceStudentQuery } = attendanceApi;
