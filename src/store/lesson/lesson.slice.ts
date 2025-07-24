import { createSlice } from "@reduxjs/toolkit";
import { LessonListItem, HomeworkSubmission, HomeworkTask } from "src/consts/types";
import {
  getLessons,
  getHomeworkSubmissions,
  submitHomeworkSubmission,
  updateHomeworkSubmission,
  deleteHomeworkSubmission,
  getHomeworkWithSubmissions,
} from "./lesson.action";

interface LessonState {
  error: string | null;
  loading: boolean;
  lessons: LessonListItem[] | null;
  homework: HomeworkSubmission[] | null;
  submissionLoading: boolean;
  submissionError: string | null;
  selectedHomework: HomeworkTask | null;
  selectedSubmissions: HomeworkSubmission[] | null;
}

const INIT_LESSON_STATE: LessonState = {
  error: null,
  loading: false,
  lessons: null,
  homework: null,
  submissionLoading: false,
  submissionError: null,
  selectedHomework: null,
  selectedSubmissions: null,
};

export const lessonSlice = createSlice({
  name: "lesson",
  initialState: INIT_LESSON_STATE,
  reducers: {
    clearSubmissionError: (state) => {
      state.submissionError = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    removeHomeworkSubmission: (state, action) => {
      if (state.homework) {
        state.homework = state.homework.filter(
          (submission) => submission.id !== action.payload
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLessons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLessons.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.lessons = payload;
        state.error = null;
      })
      .addCase(getLessons.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })

      .addCase(getHomeworkSubmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getHomeworkSubmissions.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.homework = payload;
        state.error = null;
      })
      .addCase(getHomeworkSubmissions.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })

      .addCase(submitHomeworkSubmission.pending, (state) => {
        state.submissionLoading = true;
        state.submissionError = null;
      })
      .addCase(submitHomeworkSubmission.fulfilled, (state, { payload }) => {
        state.submissionLoading = false;
        state.submissionError = null;
        if (state.homework) {
          state.homework = [...state.homework, payload];
        } else {
          state.homework = [payload];
        }
      })
      .addCase(submitHomeworkSubmission.rejected, (state, { payload }) => {
        state.submissionLoading = false;
        state.submissionError = payload as string;
      })

      .addCase(updateHomeworkSubmission.pending, (state) => {
        state.submissionLoading = true;
        state.submissionError = null;
      })
      .addCase(updateHomeworkSubmission.fulfilled, (state, { payload }) => {
        state.submissionLoading = false;
        state.submissionError = null;
        if (state.homework) {
          state.homework = state.homework.map((submission) =>
            submission.id === payload.id ? payload : submission
          );
        }
      })
      .addCase(updateHomeworkSubmission.rejected, (state, { payload }) => {
        state.submissionLoading = false;
        state.submissionError = payload as string;
      })

      .addCase(deleteHomeworkSubmission.pending, (state) => {
        state.submissionLoading = true;
        state.submissionError = null;
      })
      .addCase(deleteHomeworkSubmission.fulfilled, (state, { payload }) => {
        state.submissionLoading = false;
        state.submissionError = null;
        if (state.homework) {
          state.homework = state.homework.filter(
            (submission) => submission.id !== payload
          );
        }
      })
      .addCase(deleteHomeworkSubmission.rejected, (state, { payload }) => {
        state.submissionLoading = false;
        state.submissionError = payload as string;
      }).addCase(getHomeworkWithSubmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedHomework = null;
        state.selectedSubmissions = null;
      })
      .addCase(getHomeworkWithSubmissions.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.selectedHomework = payload.homework;
        state.selectedSubmissions = payload.submissions;
      })
      .addCase(getHomeworkWithSubmissions.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
        state.selectedHomework = null;
        state.selectedSubmissions = null;
      });
  },
});

export const { clearSubmissionError, clearError, removeHomeworkSubmission } = lessonSlice.actions;