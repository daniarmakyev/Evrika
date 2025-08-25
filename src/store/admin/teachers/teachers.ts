"use client";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "src/consts/api";
import type { TeachersResponse, GetTeachersParams } from "src/consts/types";

interface Teacher {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  role: string;
  password?: string;
  group_ids?: number[];
}

interface TeacherForm {
  full_name: string;
  email: string;
  phone_number: string;
  role: string;
  description: string;
}

interface UpdateTeacher{
  full_name:string;
  email:string;
  phone_number:string;
  description:string
}
type UpdateTeacherArgs = {
  teacherId: number|null;
  teacherData: UpdateTeacher;
};

// interface ValidationError {
//   type?: string;
//   loc?: string[];
//   msg: string;
//   input?: unknown;
// }

export const teacherApi = createApi({
  reducerPath: "teacherApi",
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
  tagTypes: ["teachers"],
  endpoints: (builder) => ({
    registerTeacher: builder.mutation<
      Teacher,
      { groupId: number|null; teacherData: TeacherForm }
    >({
      query: ({ groupId, teacherData }) => ({
        url: `/auth/register-teacher-with-group?${groupId}`,
        method: "POST",
        body: teacherData,
      }),
        invalidatesTags: ["teachers"],
    }),
    getTeacherList: builder.query<TeachersResponse, GetTeachersParams>({
      query: ({ course_id, page = 1, size = 20 }) =>
        `/user/teachers/?page=${page}&size=${size}&cours_id=${course_id}`,
      providesTags: ["teachers"],
    }),
    // getUserInfo: builder.query<User, { user_id: string }>({
    //   query: ({ user_id }) => `/user/${user_id}`,
    // }),
    // getGroupList: builder.query<CoursesResponse, void>({
    //   query: () => `/group-students`,
    // }),
    // getStudentHomeworkGroupId: builder.query<
    //   HomeworkResponse,
    //   GetHomeworkParams
    // >({
    //   query: ({ user_id, group_id, page = 1, size = 20 }) =>
    //     `/submissions/user/${user_id}?${group_id}&page=${page}&size=${size}`,
    // }),
    updateTeacher: builder.mutation<UpdateTeacher,UpdateTeacherArgs>({
      query: ({teacherId, teacherData} ) => ({
        url: `user/teacher/${teacherId}`,
        method: "PATCH",
        body: teacherData,
      }),
      invalidatesTags: ["teachers"]
    }),

    deleteTeacher: builder.mutation<void, number>({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["teachers"],
    }),
  }),
});

export const {
  useGetTeacherListQuery,
  useRegisterTeacherMutation,
  // useGetUserInfoQuery,
  // useGetGroupListQuery,
  useDeleteTeacherMutation,
  // useGetStudentHomeworkGroupIdQuery,
  useUpdateTeacherMutation
} = teacherApi;
