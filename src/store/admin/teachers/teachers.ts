"use client";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "src/consts/api";
import type {
  TeachersResponse,
  GetTeachersParams
  
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
    // registerStudent: builder.mutation<
    //   Student,
    //   { groupIds: number[]; studentData: StudentForm }
    // >({
    //   query: ({ groupIds, studentData }) => ({
    //     url: `/auth/register-student-with-group?${qs.stringify(
    //       { group_id: groupIds },
    //       { arrayFormat: "repeat" }
    //     )}`,
    //     method: "POST",
    //     body: studentData,
    //   }),

      // transformErrorResponse: (response: {
      //   data?: ValidationError[];
      //   status: number;
      // }) => {
      //   // возвращаем массив ошибок или один объект с msg
      //   if (response?.data) return response.data;
      //   return [{ msg: "Не удалось зарегистрировать студента" }];
      // },
    //   invalidatesTags: ["Students"],
    // }),
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
    // updateStudent: builder.mutation<UpdateStudent,UpdateStudentArgs>({
    //   query: ({studentId, studentData} ) => ({
    //     url: `user/${studentId}`,
    //     method: "PATCH",
    //     body: studentData,
    //   }),
    //   invalidatesTags: ["Students"]
    // }),
    
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
  // useGetUserInfoQuery,
  // useGetGroupListQuery,
  useDeleteTeacherMutation,
  // useGetStudentHomeworkGroupIdQuery,
  // useUpdateStudentMutation
} = teacherApi;
