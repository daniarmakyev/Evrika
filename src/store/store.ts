import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { sheduleSlice } from "./shedule/shedule.slice";
import { studentSlice } from "./users/student/student.slice";
import { lessonSlice } from "./lesson/lesson.slice";


export const store = configureStore({
    reducer: {
        shedule: sheduleSlice.reducer,
        student: studentSlice.reducer,
        lesson: lessonSlice.reducer,
    },
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();


