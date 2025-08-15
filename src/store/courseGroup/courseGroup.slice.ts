import { createSlice } from "@reduxjs/toolkit";
import {
    getCourses,
    getLanguages,
    getLevels,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourse,
    createLanguage,
    createLevel,
    getGroups,
    getGroup,
    createGroup,
    updateGroup,
    deleteGroup,
    getTeachers,
} from "./courseGroup.action";
import { Course, Language, Level, Group, Teacher } from "src/consts/types";

interface GroupsCoursesState {
    error: string | null;
    loadingCourses: boolean;
    loadingGroups: boolean;
    loadingLevels: boolean;
    loadingLanguages: boolean;
    loadingTeachers: boolean;
    creatingCourse: boolean;
    updatingCourse: boolean;
    deletingCourse: boolean;
    creatingGroup: boolean;
    updatingGroup: boolean;
    deletingGroup: boolean;
    groups: Group[] | null;
    courses: Course[] | null;
    levels: Level[] | null;
    languages: Language[] | null;
    teachers: Teacher[] | null;
    selectedCourse: Course | null;
    selectedGroup: Group | null;
}

const INIT_STATE: GroupsCoursesState = {
    error: null,
    loadingGroups: false,
    loadingCourses: false,
    loadingLevels: false,
    loadingLanguages: false,
    loadingTeachers: false,
    creatingCourse: false,
    updatingCourse: false,
    deletingCourse: false,
    creatingGroup: false,
    updatingGroup: false,
    deletingGroup: false,
    groups: null,
    courses: null,
    levels: null,
    languages: null,
    teachers: null,
    selectedCourse: null,
    selectedGroup: null,
};

export const courseGroupSlice = createSlice({
    name: "courseGroup",
    initialState: INIT_STATE,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSelectedCourse: (state) => {
            state.selectedCourse = null;
        },
        clearSelectedGroup: (state) => {
            state.selectedGroup = null;
        },
    },
    extraReducers: (builder) => {
        // Существующие reducers для курсов
        builder
            .addCase(getCourses.pending, (state) => {
                state.loadingCourses = true;
                state.error = null;
            })
            .addCase(getCourses.fulfilled, (state, { payload }) => {
                state.loadingCourses = false;
                state.courses = payload;
                state.error = null;
            })
            .addCase(getCourses.rejected, (state, { payload }) => {
                state.loadingCourses = false;
                state.error = payload || "Failed to get courses";
                state.courses = null;
            })

        builder
            .addCase(getCourse.pending, (state) => {
                state.error = null;
            })
            .addCase(getCourse.fulfilled, (state, { payload }) => {
                state.selectedCourse = payload;
                state.error = null;
            })
            .addCase(getCourse.rejected, (state, { payload }) => {
                state.error = payload || "Failed to get course";
                state.selectedCourse = null;
            })

        builder
            .addCase(createCourse.pending, (state) => {
                state.creatingCourse = true;
                state.error = null;
            })
            .addCase(createCourse.fulfilled, (state, { payload }) => {
                state.creatingCourse = false;
                if (state.courses) {
                    state.courses.push(payload);
                } else {
                    state.courses = [payload];
                }
                state.error = null;
            })
            .addCase(createCourse.rejected, (state, { payload }) => {
                state.creatingCourse = false;
                state.error = payload || "Failed to create course";
            })

        builder
            .addCase(updateCourse.pending, (state) => {
                state.updatingCourse = true;
                state.error = null;
            })
            .addCase(updateCourse.fulfilled, (state, { payload }) => {
                state.updatingCourse = false;
                if (state.courses) {
                    const index = state.courses.findIndex(course => course.id === payload.id);
                    if (index !== -1) {
                        state.courses[index] = payload;
                    }
                }
                if (state.selectedCourse && state.selectedCourse.id === payload.id) {
                    state.selectedCourse = payload;
                }
                state.error = null;
            })
            .addCase(updateCourse.rejected, (state, { payload }) => {
                state.updatingCourse = false;
                state.error = payload || "Failed to update course";
            })

        builder
            .addCase(deleteCourse.pending, (state) => {
                state.deletingCourse = true;
                state.error = null;
            })
            .addCase(deleteCourse.fulfilled, (state, { payload }) => {
                state.deletingCourse = false;
                if (state.courses) {
                    state.courses = state.courses.filter(course => course.id !== payload);
                }
                if (state.selectedCourse && state.selectedCourse.id === payload) {
                    state.selectedCourse = null;
                }
                state.error = null;
            })
            .addCase(deleteCourse.rejected, (state, { payload }) => {
                state.deletingCourse = false;
                state.error = payload || "Failed to delete course";
            })

        builder
            .addCase(getLevels.pending, (state) => {
                state.loadingLevels = true;
                state.error = null;
            })
            .addCase(getLevels.fulfilled, (state, { payload }) => {
                state.loadingLevels = false;
                state.levels = payload;
                state.error = null;
            })
            .addCase(getLevels.rejected, (state, { payload }) => {
                state.loadingLevels = false;
                state.error = payload || "Failed to get levels";
                state.levels = null;
            })

        builder
            .addCase(createLevel.pending, (state) => {
                state.error = null;
            })
            .addCase(createLevel.fulfilled, (state, { payload }) => {
                if (state.levels) {
                    state.levels.push(payload);
                } else {
                    state.levels = [payload];
                }
                state.error = null;
            })
            .addCase(createLevel.rejected, (state, { payload }) => {
                state.error = payload || "Failed to create level";
            })

        builder
            .addCase(getLanguages.pending, (state) => {
                state.loadingLanguages = true;
                state.error = null;
            })
            .addCase(getLanguages.fulfilled, (state, { payload }) => {
                state.loadingLanguages = false;
                state.languages = payload;
                state.error = null;
            })
            .addCase(getLanguages.rejected, (state, { payload }) => {
                state.loadingLanguages = false;
                state.error = payload || "Failed to get languages";
                state.languages = null;
            })

        builder
            .addCase(createLanguage.pending, (state) => {
                state.error = null;
            })
            .addCase(createLanguage.fulfilled, (state, { payload }) => {
                if (state.languages) {
                    state.languages.push(payload);
                } else {
                    state.languages = [payload];
                }
                state.error = null;
            })
            .addCase(createLanguage.rejected, (state, { payload }) => {
                state.error = payload || "Failed to create language";
            })

        builder
            .addCase(getGroups.pending, (state) => {
                state.loadingGroups = true;
                state.error = null;
            })
            .addCase(getGroups.fulfilled, (state, { payload }) => {
                state.loadingGroups = false;
                state.groups = payload;
                state.error = null;
            })
            .addCase(getGroups.rejected, (state, { payload }) => {
                state.loadingGroups = false;
                state.error = payload || "Failed to get groups";
                state.groups = null;
            })

        builder
            .addCase(getGroup.pending, (state) => {
                state.error = null;
            })
            .addCase(getGroup.fulfilled, (state, { payload }) => {
                state.selectedGroup = payload;
                state.error = null;
            })
            .addCase(getGroup.rejected, (state, { payload }) => {
                state.error = payload || "Failed to get group";
                state.selectedGroup = null;
            })

        builder
            .addCase(createGroup.pending, (state) => {
                state.creatingGroup = true;
                state.error = null;
            })
            .addCase(createGroup.fulfilled, (state, { payload }) => {
                state.creatingGroup = false;
                if (state.groups) {
                    state.groups.push(payload);
                } else {
                    state.groups = [payload];
                }
                state.error = null;
            })
            .addCase(createGroup.rejected, (state, { payload }) => {
                state.creatingGroup = false;
                state.error = payload || "Failed to create group";
            })

        builder
            .addCase(updateGroup.pending, (state) => {
                state.updatingGroup = true;
                state.error = null;
            })
            .addCase(updateGroup.fulfilled, (state, { payload }) => {
                state.updatingGroup = false;
                if (state.groups) {
                    const index = state.groups.findIndex(group => group.id === payload.id);
                    if (index !== -1) {
                        state.groups[index] = payload;
                    }
                }
                if (state.selectedGroup && state.selectedGroup.id === payload.id) {
                    state.selectedGroup = payload;
                }
                state.error = null;
            })
            .addCase(updateGroup.rejected, (state, { payload }) => {
                state.updatingGroup = false;
                state.error = payload || "Failed to update group";
            })

        builder
            .addCase(deleteGroup.pending, (state) => {
                state.deletingGroup = true;
                state.error = null;
            })
            .addCase(deleteGroup.fulfilled, (state, { payload }) => {
                state.deletingGroup = false;
                if (state.groups) {
                    state.groups = state.groups.filter(group => group.id !== payload);
                }
                if (state.selectedGroup && state.selectedGroup.id === payload) {
                    state.selectedGroup = null;
                }
                state.error = null;
            })
            .addCase(deleteGroup.rejected, (state, { payload }) => {
                state.deletingGroup = false;
                state.error = payload || "Failed to delete group";
            })

        builder
            .addCase(getTeachers.pending, (state) => {
                state.loadingTeachers = true;
                state.error = null;
            })
            .addCase(getTeachers.fulfilled, (state, { payload }) => {
                state.loadingTeachers = false;
                state.teachers = payload;
                state.error = null;
            })
            .addCase(getTeachers.rejected, (state, { payload }) => {
                state.loadingTeachers = false;
                state.error = payload || "Failed to get teachers";
                state.teachers = null;
            })

    },
});

export const { clearError, clearSelectedCourse, clearSelectedGroup } = courseGroupSlice.actions;