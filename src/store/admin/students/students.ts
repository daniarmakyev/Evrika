"use client";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "src/consts/api";
import type {
  StudentsResponse,
  GetStudentsParams,
  User,
  CoursesResponse,
  HomeworkResponse,
  GetHomeworkParams,
  UpdateStudent
} from "src/consts/types";
import qs from "qs";

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
type UpdateStudentArgs = {
  studentId: number|undefined;
  studentData: UpdateStudent;
};


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
  tagTypes: ["Students"],
  endpoints: (builder) => ({
    registerStudent: builder.mutation<
      Student,
      { groupIds: number[]; studentData: StudentForm }
    >({
      query: ({ groupIds, studentData }) => ({
        url: `/auth/register-student-with-group?${qs.stringify(
          { group_id: groupIds },
          { arrayFormat: "repeat" }
        )}`,
        method: "POST",
        body: studentData,
      }),

      invalidatesTags: ["Students"],
    }),
    getStudentList: builder.query<StudentsResponse, GetStudentsParams>({
      query: ({ user_id, page = 1, size = 20 }) =>
        `/user/students/?page=${page}&size=${size}&group_id=${user_id}`,
      providesTags: ["Students"],
    }),
    getUserInfo: builder.query<User, { user_id: string }>({
      query: ({ user_id }) => `/user/${user_id}`,
    }),
    getGroupList: builder.query<CoursesResponse, void>({
      query: () => `/group-students`,
    }),
    getStudentHomeworkGroupId: builder.query<
      HomeworkResponse,
      GetHomeworkParams
    >({
      query: ({ user_id, group_id, page = 1, size = 20 }) =>
        `/submissions/user/${user_id}?${group_id}&page=${page}&size=${size}`,
    }),
    updateStudent: builder.mutation<UpdateStudent,UpdateStudentArgs>({
      query: ({studentId, ...studentData} ) => ({
        url: `/user/student/${studentId}`,
        method: "PATCH",
        body: studentData,
      }),
      invalidatesTags: ["Students"]
    }),
    
    deleteStudent: builder.mutation<void, number>({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Students"],
    }),
  }),
});

export const {
  useRegisterStudentMutation,
  useGetStudentListQuery,
  useGetUserInfoQuery,
  useGetGroupListQuery,
  useDeleteStudentMutation,
  useGetStudentHomeworkGroupIdQuery,
  useUpdateStudentMutation
} = studentApi;
