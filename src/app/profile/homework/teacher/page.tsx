"use client";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import Table from "@components/Table";
import FileIcon from "@icons/upload-file.svg";
import EditPen from "@icons/edit-pen.svg";
import Close from "@icons/close.svg";
import classNames from "classnames";
import { useAppDispatch, useAppSelector } from "src/store/store";
import {
  getLessons,
  getHomeworkWithSubmissions,
} from "src/store/lesson/lesson.action";
import { HomeworkTask, LessonListItem } from "src/consts/types";
import { useModal } from "@context/ModalContext";

import {
  clearError,
  clearSubmissionError,
  clearRefreshFlag,
} from "src/store/lesson/lesson.slice";
import {
  TeacherHomeworkViewModal,
  TeacherHomeworkEditModal,
  TeacherHomeworkCreateModal,
} from "@components/TeacherHomeworkModal";

interface TeacherHomeworkTableItem {
  id: number;
  group: string;
  assignment: string;
  deadline: string;
  viewHomework: string;
  homeworkId: number;
  lessonId: number;
  homeworkData: HomeworkTask;
}

const TableSkeleton = () => (
  <div className={styles.tableSkeleton}>
    <div className={styles.tableHeaderSkeleton}>
      <div className={styles.skeletonHeaderCell}></div>
      <div className={styles.skeletonHeaderCell}></div>
      <div className={styles.skeletonHeaderCell}></div>
      <div className={styles.skeletonHeaderCell}></div>
      <div className={styles.skeletonHeaderCell}></div>
    </div>
    <div className={styles.tableBodySkeleton}>
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className={styles.tableRowSkeletonDiv}>
          <div className={styles.skeletonCell}></div>
          <div className={styles.skeletonCell}></div>
          <div className={styles.skeletonCell}></div>
          <div className={styles.skeletonCell}></div>
          <div className={styles.skeletonButtonCell}></div>
        </div>
      ))}
    </div>
  </div>
);

export default function TeacherHomework() {
  const dispatch = useAppDispatch();
  const {
    selectedSubmissions,
    loading,
    error,
    submissionError,
    lessons,
    shouldRefresh,
  } = useAppSelector((state) => state.lesson);

  const [lessonState, setLessonState] = useState<LessonListItem[]>([]);
  const [tableData, setTableData] = useState<TeacherHomeworkTableItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const viewModal = useModal<{
    homework: TeacherHomeworkTableItem;
  }>("view");
  const editModal = useModal<TeacherHomeworkTableItem>("edit");
  const createModal = useModal<object>("create");

  const reloadLessons = React.useCallback(() => {
    const groupsId = localStorage.getItem("groups");
    if (groupsId) {
      try {
        const parsedIds: string[] = JSON.parse(groupsId);
        if (parsedIds && Array.isArray(parsedIds)) {
          setLessonState([]);
          setTableData([]);

          parsedIds.forEach((id) => {
            dispatch(getLessons(id));
          });
        }
      } catch (error) {
        console.error("Ошибка перезагрузки групп:", error);
        setErrorMessage("Ошибка при перезагрузке групп");
      }
    }
  }, [dispatch]);

  useEffect(() => {
    if (shouldRefresh) {
      reloadLessons();
      dispatch(clearRefreshFlag());
    }
  }, [shouldRefresh, dispatch, reloadLessons]);

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
      const timer = setTimeout(() => {
        setErrorMessage(null);
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (submissionError) {
      setErrorMessage(submissionError);
      const timer = setTimeout(() => {
        setErrorMessage(null);
        dispatch(clearSubmissionError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submissionError, dispatch]);

  useEffect(() => {
    const groupsId = localStorage.getItem("groups");

    if (groupsId) {
      try {
        const parsedIds: string[] = JSON.parse(groupsId);
        if (parsedIds && Array.isArray(parsedIds)) {
          parsedIds.forEach((id) => {
            dispatch(getLessons(id));
          });
        }
      } catch (error) {
        console.error("Ошибка вставки груп с локал стореджа:", error);
        setErrorMessage("Ошибка при загрузке групп");
      }
    }
  }, [dispatch]);

  useEffect(() => {
    if (lessons && lessons.length > 0) {
      setLessonState((prev) => {
        const newLessons = lessons.filter(
          (lesson) => !prev.some((item) => item.id === lesson.id)
        );
        return [...prev, ...newLessons];
      });
    }
  }, [lessons]);

  useEffect(() => {
    if (lessonState.length > 0) {
      const formattedData: TeacherHomeworkTableItem[] = lessonState
        .filter((lesson) => lesson.homework)
        .map((lesson) => ({
          id: lesson.id,
          group: lesson.group_name,
          assignment: lesson.homework?.description || "",
          deadline: lesson.homework?.deadline
            ? new Date(lesson.homework.deadline).toLocaleDateString()
            : "",
          viewHomework: "",
          homeworkId: lesson.homework?.id || 0,
          lessonId: lesson.id,
          homeworkData: lesson.homework!,
        }));

      setTableData(formattedData);
    }
  }, [lessonState]);

  const handleOpenCreateModal = () => {
    createModal.openModal({});
  };

  const handleOpenViewModal = (homework: TeacherHomeworkTableItem) => {
    dispatch(getHomeworkWithSubmissions(homework.homeworkId));
    viewModal.openModal({ homework });
  };

  const handleOpenEditModal = (homework: TeacherHomeworkTableItem) => {
    editModal.openModal(homework);
  };

  const handleDismissError = () => {
    setErrorMessage(null);
    dispatch(clearError());
    dispatch(clearSubmissionError());
  };

  const handleCreateSuccess = () => {
    createModal.closeModal();
    reloadLessons();
  };

  // const handleEditSuccess = () => {
  //   editModal.closeModal();
  //   reloadLessons();
  // };

  const teacherHomeworkColumns = [
    {
      key: "group",
      title: "Группа",
      width: "200px",
    },
    {
      key: "assignment",
      title: "Задание",
      width: "300px",
      render: (value: string) => {
        return (
          <span>
            {value.length > 30 ? value.substring(0, 30) + "..." : value}
          </span>
        );
      },
    },
    {
      key: "deadline",
      title: "Дедлайн",
      width: "150px",
    },
    {
      key: "viewHomework",
      title: "Посмотреть ДЗ",
      width: "200px",
      isButton: true,
      render: (_: string, row: TeacherHomeworkTableItem) => (
        <div style={{ display: "flex", gap: "10px", flexDirection: "row" }}>
          <button
            onClick={() => handleOpenViewModal(row)}
            className={styles.actionButton}
            title="Просмотреть домашнее задание"
          >
            <FileIcon />
          </button>
          <button
            onClick={() => handleOpenEditModal(row)}
            className={styles.actionButton}
            title="Редактировать задание"
          >
            <EditPen />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className={classNames(styles.homework__container, "container")}>
      <div className={styles.homework__content}>
        <div className={styles.homework__header}>
          <div className={styles.homework__title}>
            <h3 style={{fontWeight:800, fontSize:"24px"}}>Домашнее задание</h3>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className={styles.add__button}
          >
            <span>Добавить</span>
          </button>
        </div>

        {errorMessage && (
          <div className={styles.errorNotification}>
            <span>{errorMessage}</span>
            <button
              onClick={handleDismissError}
              className={styles.dismissButton}
            >
              <Close />
            </button>
          </div>
        )}

        {loading || !lessons ? (
          <TableSkeleton />
        ) : (
          <div className={styles.homework__table}>
            <Table
              columns={teacherHomeworkColumns}
              data={tableData}
              emptyMessage="Нет домашних заданий"
            />
          </div>
        )}

        <TeacherHomeworkViewModal
          isOpen={viewModal.isOpen}
          onClose={viewModal.closeModal}
          homework={viewModal.data?.homework}
          submissions={selectedSubmissions}
          loading={loading}
        />
        <TeacherHomeworkEditModal
          isOpen={editModal.isOpen}
          onClose={editModal.closeModal}
          data={editModal.data}
        />
        <TeacherHomeworkCreateModal
          isOpen={createModal.isOpen}
          onClose={createModal.closeModal}
          data={createModal.data}
          lessons={lessonState}
          onSuccess={handleCreateSuccess}
        />
      </div>
    </div>
  );
}
