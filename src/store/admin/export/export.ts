import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "src/consts/api";

export const exportApi = createApi({
  reducerPath: "exportApi",
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
    exportTeachers: builder.mutation<
      Blob,
      { course_id?: number|null; search?: string; format: "csv" | "xlsx" }
    >({
      query: (params) => ({
        url: "/export/teachers",
        method: "GET",
        params, 
        responseHandler: (response) => response.blob(),
      }),
    }),
    exportStudents: builder.mutation<
      Blob,
      { group_id: number|null; search?: string; format: "csv" | "xlsx" }
    >({
      query: (params) => ({
        url: "/export/students",
        method: "GET",
        params, 
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const { useExportTeachersMutation,useExportStudentsMutation } = exportApi;
