import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { useDispatch, useSelector } from "react-redux";
import { sheduleSlice } from "./shedule/shedule.slice";
import { lessonSlice } from "./lesson/lesson.slice";
import { userSlice } from "./user/user.slice";
import { attendanceApi } from "./attendance/attendance";
import { studentApi } from "./admin/students/students";
import { teacherApi } from "./admin/teachers/teachers";
import { courseGroupSlice } from "./courseGroup/courseGroup.slice";
import { financeSlice } from "./finance/finance.slice";

export const store = configureStore({
  reducer: {
    shedule: sheduleSlice.reducer,
    user: userSlice.reducer,
    lesson: lessonSlice.reducer,
    groupsCourses: courseGroupSlice.reducer,
    finance: financeSlice.reducer,
    [attendanceApi.reducerPath]: attendanceApi.reducer,
    [studentApi.reducerPath]:studentApi.reducer,
    [teacherApi.reducerPath]:teacherApi.reducer
    
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(attendanceApi.middleware, studentApi.middleware,teacherApi.middleware),
});
setupListeners(store.dispatch);

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
