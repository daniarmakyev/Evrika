"use client";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "src/consts/api";
interface Student {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  role: string;
  password?: string;
  group_ids?: number[];
}

interface StudentForm {
  full_name: string;
  email: string;
  phone_number: string;
  role: string;
}

interface CustomApiError {
  detail: string;
}

export const studentApi = createApi({
  reducerPath: "studentApi",
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
    registerStudent: builder.mutation<
      Student,
      { groupIds: number[]; studentData: StudentForm }
    >({
      query: ({ groupIds, studentData }) => ({
        url: `/auth/register-student-with-group/${groupIds.join(",")}`,
        method: "POST",
        body: studentData,
      }),
      transformErrorResponse: (response: {
        data?: CustomApiError[];
        status: number;
      }) => {
        return (
          response?.data ?? [{ msg: "***Ошибка!!!Не удалось зарегистрировать студента" }]
        );
      },
    }),
  }),
});

export const { useRegisterStudentMutation } = studentApi;
