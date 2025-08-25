import { createSelector } from '@reduxjs/toolkit';
import { studentApi } from './students';

export const selectGroupsByStudent = (studentId: number) =>
  createSelector(
    studentApi.endpoints.getGroupList.select(),
    (result) => {
      if (!result?.data) return [];
      console.log(result.data, studentId); // move log outside filter
      return result.data.filter(group =>
        group.students?.some(student => student.id === studentId)
      );
    }
  );