import { createSlice } from "@reduxjs/toolkit";
import { LessonListItem, HomeworkSubmission, HomeworkTask, Classroom, StudentByTeacherResponseType } from "src/consts/types";
import {
  getLessons,
  getHomeworkSubmissions,
  submitHomeworkSubmission,
  updateHomeworkSubmission,
  deleteHomeworkSubmission,
  getHomeworkWithSubmissions,
  createHomeworkAssignment,
  deleteHomeworkAssignment,
  updateHomeworkAssignment,
  getClassrooms,
  getStudentHomeWorkByTeacher,
  updateHomeworkReview,
  createHomeworkReview,

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
  shouldRefresh: boolean;
  classrooms: Classroom[] | null;
  studentHomeworks: StudentByTeacherResponseType | null;
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
  shouldRefresh: false,
  classrooms: null,
  studentHomeworks: null,

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
    setShouldRefresh: (state) => {
      state.shouldRefresh = true;
    },
    clearRefreshFlag: (state) => {
      state.shouldRefresh = false;
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
        state.shouldRefresh = false;
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
      })

      .addCase(getHomeworkWithSubmissions.pending, (state) => {
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
      })

      .addCase(createHomeworkAssignment.pending, (state) => {
        state.submissionLoading = true;
        state.submissionError = null;
      })
      .addCase(createHomeworkAssignment.fulfilled, (state) => {
        state.submissionLoading = false;
        state.submissionError = null;
        state.shouldRefresh = true;

      })
      .addCase(createHomeworkAssignment.rejected, (state, { payload }) => {
        state.submissionLoading = false;
        state.submissionError = payload as string;
      })

      .addCase(deleteHomeworkAssignment.pending, (state) => {
        state.submissionLoading = true;
        state.submissionError = null;
      })
      .addCase(deleteHomeworkAssignment.fulfilled, (state, { payload }) => {
        state.submissionLoading = false;
        state.submissionError = null;
        state.shouldRefresh = true;

        if (state.lessons) {
          state.lessons = state.lessons.map(lesson =>
            lesson.homework?.id === payload
              ? { ...lesson, homework: undefined }
              : lesson
          );
        }
      })
      .addCase(deleteHomeworkAssignment.rejected, (state, { payload }) => {
        state.submissionLoading = false;
        state.submissionError = payload as string;
      })

      .addCase(updateHomeworkAssignment.pending, (state) => {
        state.submissionLoading = true;
        state.submissionError = null;
      })
      .addCase(updateHomeworkAssignment.fulfilled, (state, { payload }) => {
        state.submissionLoading = false;
        state.submissionError = null;
        state.shouldRefresh = true;

        if (state.lessons) {
          state.lessons = state.lessons.map(lesson =>
            lesson.homework?.id === payload.id
              ? { ...lesson, homework: payload }
              : lesson
          );
        }
      })
      .addCase(updateHomeworkAssignment.rejected, (state, { payload }) => {
        state.submissionLoading = false;
        state.submissionError = payload as string;
      }).addCase(getClassrooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClassrooms.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.classrooms = payload;
        state.error = null;
      })
      .addCase(getClassrooms.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      }).addCase(getStudentHomeWorkByTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.studentHomeworks = null;
      })
      .addCase(getStudentHomeWorkByTeacher.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.studentHomeworks = payload;
        state.error = null;
      })
      .addCase(getStudentHomeWorkByTeacher.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
        state.studentHomeworks = null;
      })
      .addCase(createHomeworkReview.pending, (state) => {
        state.submissionLoading = true;
        state.submissionError = null;
      })
      .addCase(createHomeworkReview.fulfilled, (state, { payload }) => {
        state.submissionLoading = false;
        state.submissionError = null;

        if (state.selectedSubmissions) {
          state.selectedSubmissions = state.selectedSubmissions.map((submission) =>
            submission.id === payload.submission_id
              ? {
                ...submission,
                review: {
                  id: payload.id,
                  comment: payload.comment
                }
              }
              : submission
          );
        }
      })
      .addCase(createHomeworkReview.rejected, (state, { payload }) => {
        state.submissionLoading = false;
        state.submissionError = payload as string;
      })

      .addCase(updateHomeworkReview.pending, (state) => {
        state.submissionLoading = true;
        state.submissionError = null;
      })
      .addCase(updateHomeworkReview.fulfilled, (state, { payload }) => {
        state.submissionLoading = false;
        state.submissionError = null;
        if (state.selectedSubmissions) {
          state.selectedSubmissions = state.selectedSubmissions.map((submission) =>
            submission.id === payload.submission_id
              ? {
                ...submission,
                review: {
                  id: payload.id,
                  comment: payload.comment
                }
              }
              : submission
          );
        }
      })
      .addCase(updateHomeworkReview.rejected, (state, { payload }) => {
        state.submissionLoading = false;
        state.submissionError = payload as string;
      });
  },
});

export const {
  clearSubmissionError,
  clearError,
  removeHomeworkSubmission,
  clearRefreshFlag,
  setShouldRefresh,
} = lessonSlice.actions;