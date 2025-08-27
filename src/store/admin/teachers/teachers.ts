"use client";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "src/consts/api";
import type {
  TeachersResponse,
  GetTeachersParams,
  WeekSchedule,
} from "src/consts/types";

interface Teacher {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  role: string;
  password?: string;
  group_ids?: number[];
}

interface Group {
  id: number;
  name: string;
}

type TeacherData = TeacherForm & {
  id:number;
  groups: Group[];
  is_active:boolean,
  courses:Group[]
};
interface TeacherForm {
  full_name: string;
  email: string;
  phone_number: string;
  role: string;
  description: string;
}

interface UpdateTeacher {
  full_name: string;
  email: string;
  phone_number: string;
  description: string;
}
type UpdateTeacherArgs = {
  teacherId: number | null;
  teacherData: UpdateTeacher;
};

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
      { groupId: number | null; teacherData: TeacherForm }
    >({
      query: ({ groupId, teacherData }) => ({
        url: `/auth/register-teacher-with-group/${groupId}`,
        method: "POST",
        body: teacherData,
      }),
      invalidatesTags: ["teachers"],
    }),
    getTeacherList: builder.query<TeachersResponse, GetTeachersParams>({
      query: ({ course_id, page = 1, size = 20 }) =>
        `/user/teachers/?page=${page}&size=${size}&course_id=${course_id}`,
      providesTags: ["teachers"],
    }),
    getTeacherInfo: builder.query<TeacherData, { user_id: string }>({
      query: ({ user_id }) => `/user/teacher/${user_id}`,
    }),
    getTeacherSchedule: builder.query<WeekSchedule, { user_id: number | null }>(
      {
        query: ({ user_id }) => `/shedule/teacher/${user_id}`,
      }
    ),
    updateTeacher: builder.mutation<UpdateTeacher, UpdateTeacherArgs>({
      query: ({ teacherId, ...teacherData }) => ({
        url: `/user/teacher/${teacherId}`,
        method: "PATCH",
        body: teacherData,
      }),
      invalidatesTags: ["teachers"],
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
  useGetTeacherInfoQuery,
  useDeleteTeacherMutation,
  useGetTeacherScheduleQuery,
  useUpdateTeacherMutation,
} = teacherApi;
