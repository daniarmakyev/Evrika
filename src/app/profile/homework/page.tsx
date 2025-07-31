"use client";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import Table from "@components/Table";
import UploadIcon from "@icons/upload-file.svg";
import EditPen from "@icons/edit-pen.svg";
import Close from "@icons/close.svg";
import classNames from "classnames";
import { useAppDispatch, useAppSelector } from "src/store/store";
import {
  getHomeworkSubmissions,
  getLessons,
} from "src/store/lesson/lesson.action";
import {
  HomeworkSubmission,
  HomeworkTask,
  LessonListItem,
} from "src/consts/types";
import { useModal } from "@context/ModalContext";
import {
  HomeworkTaskModal,
  LessonInfoModal,
  HomeworkSubmissionModal,
  HomeworkUploadModal,
} from "@components/HomeworkModals";
import ProfileModal from "@components/ProfileModal";
import {
  clearError,
  clearSubmissionError,
} from "src/store/lesson/lesson.slice";
import TextArea from "@components/Fields/TextAreaField";

interface HomeWorkTableItem {
  id: number;
  group: string;
  lesson: string;
  task: string;
  deadline: string;
  upload: string;
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
          <div className={styles.skeletonCell}></div>
          <div className={styles.skeletonButtonCell}></div>
        </div>
      ))}
    </div>
  </div>
);

export default function ProfileHomeWork() {
  const dispatch = useAppDispatch();
  const { homework, lessons, loading, error, submissionError } = useAppSelector(
    (state) => state.lesson
  );
  const [homeworkState, setHomeworkState] = useState<HomeworkSubmission[]>([]);
  const [lessonState, setLessonState] = useState<LessonListItem[]>([]);
  const [tableData, setTableData] = useState<HomeWorkTableItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [, setUploadForm] = useState({
    answer: "",
    file: null as File | null,
  });

  const taskModal = useModal<HomeworkTask>("task");
  const lessonModal = useModal<LessonListItem>("lesson");
  const submissionModal = useModal<{
    homework: HomeWorkTableItem;
    submission: HomeworkSubmission;
  }>("submission");
  const uploadModal = useModal<{
    homework: HomeWorkTableItem;
    submission?: HomeworkSubmission;
    isEdit?: boolean;
  }>("upload");

  const [noteModal, setNoteModal] = useState<{
    open: boolean;
    note: string | null;
  }>({ open: false, note: null });

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
    if (uploadModal.isOpen && uploadModal.data) {
      const submissionId = uploadModal.data.submission?.id;
      if (submissionId) {
        const updatedSubmission = homeworkState.find(
          (s) => s.id === submissionId
        );
        if (
          updatedSubmission &&
          updatedSubmission !== uploadModal.data.submission
        ) {
          uploadModal.openModal({
            ...uploadModal.data,
            submission: updatedSubmission,
          });
        }
      } else if (uploadModal.data && uploadModal.data.homework) {
        const newSubmission = homeworkState.find(
          (s) => s.homework_id === uploadModal.data!.homework.homeworkId
        );
        if (newSubmission) {
          uploadModal.openModal({
            ...uploadModal.data,
            submission: newSubmission,
          });
        }
      }
    }
    if (submissionModal.isOpen && submissionModal.data) {
      const submissionId = submissionModal.data.submission?.id;
      if (submissionId) {
        const updatedSubmission = homeworkState.find(
          (s) => s.id === submissionId
        );
        if (updatedSubmission) {
          submissionModal.openModal({
            ...submissionModal.data,
            submission: updatedSubmission,
          });
        }
      }
    }
  }, [homeworkState, submissionModal, uploadModal]);

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
      lessons.forEach((lesson) => {
        if (lesson && lesson.homework && lesson.homework.id) {
          dispatch(getHomeworkSubmissions(lesson.homework.id));
        }
      });
    }
  }, [lessons, dispatch]);

  useEffect(() => {
    if (homework) {
      if (homework.length > 0) {
        setHomeworkState((prev) => {
          const map = new Map<number, (typeof homework)[0]>();

          prev.forEach((item) => {
            map.set(item.id, item);
          });

          homework.forEach((item) => {
            map.set(item.id, item);
          });

          return Array.from(map.values());
        });
      } else {
        setHomeworkState((prev) => {
          const currentIds = new Set(homework.map((item) => item.id));

          return prev.filter((item) => currentIds.has(item.id));
        });
      }
    }
  }, [homework]);

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
      const formattedData: HomeWorkTableItem[] = lessonState
        .filter((lesson) => lesson.homework)
        .map((lesson) => ({
          id: lesson.id,
          group: lesson.group_name,
          lesson: lesson.name,
          task: lesson.homework?.description || "",
          deadline: lesson.homework?.deadline
            ? new Date(lesson.homework.deadline).toLocaleDateString()
            : "",
          upload: "",
          homeworkId: lesson.homework?.id || 0,
          lessonId: lesson.id,
          homeworkData: lesson.homework!,
        }));

      setTableData(formattedData);
    }
  }, [lessonState, homeworkState]);

  const handleOpenTaskModal = (homework: HomeWorkTableItem) => {
    if (homework?.homeworkData) {
      taskModal.openModal(homework.homeworkData);
    }
  };

  const handleOpenLessonModal = (homework: HomeWorkTableItem) => {
    const lesson = lessonState.find((l) => l.id === homework.lessonId);
    if (lesson) {
      lessonModal.openModal(lesson);
    }
  };

  const handleOpenUploadModal = (
    homework: HomeWorkTableItem,
    submission?: HomeworkSubmission,
    isEdit?: boolean
  ) => {
    if (homework) {
      setUploadForm({
        answer: submission?.content || "",
        file: null,
      });
      uploadModal.openModal({ homework, submission, isEdit });
    }
  };

  const handleOpenSubmissionModal = (
    homework: HomeWorkTableItem,
    submission: HomeworkSubmission
  ) => {
    if (homework && submission) {
      submissionModal.openModal({ homework, submission });
    }
  };

  const getSubmissionForHomework = (
    homeworkId: number
  ): HomeworkSubmission | undefined => {
    return homeworkState.find(
      (submission) => submission.homework_id === homeworkId
    );
  };

  const handleDismissError = () => {
    setErrorMessage(null);
    dispatch(clearError());
    dispatch(clearSubmissionError());
  };

  const homeWorkColumns = [
    {
      key: "group",
      title: "Группа",
      width: "230px",
    },
    {
      key: "lesson",
      title: "Урок",
      width: "220px",
      isButton: true,
      render: (value: string, row: HomeWorkTableItem) => {
        return (
          <button
            onClick={() => handleOpenLessonModal(row)}
            className={styles.table__button}
          >
            <span>
              {value.length > 50 ? value.substring(0, 50) + "..." : value}
            </span>
          </button>
        );
      },
    },
    {
      key: "task",
      title: "Задание",
      width: "220px",
      isButton: true,
      render: (value: string, row: HomeWorkTableItem) => {
        return (
          <button
            onClick={() => handleOpenTaskModal(row)}
            className={styles.table__button}
          >
            <span>
              {value.length > 50 ? value.substring(0, 50) + "..." : value}
            </span>
          </button>
        );
      },
    },
    {
      key: "note",
      title: "Примечание",
      width: "180px",
      render: (_: string, row: HomeWorkTableItem) => {
        const submission = getSubmissionForHomework(row.homeworkId);
        if (submission && submission.review) {
          return (
            <button
              className={styles.table__button}
              style={{
                color: "#8399ff",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() =>
                setNoteModal({ open: true, note: submission.review!.comment })
              }
            >
              {submission.review.comment.length > 30
                ? submission.review.comment.substring(0, 30) + "..."
                : submission.review.comment}
            </button>
          );
        }
        return null;
      },
    },
    {
      key: "deadline",
      title: "Срок сдачи",
      width: "140px",
    },
    {
      key: "status",
      title: "Статус",
      width: "140px",
      render: (_: string, row: HomeWorkTableItem) => {
        const submission = getSubmissionForHomework(row.homeworkId);
        return (
          <span
            style={{
              color: submission ? "green" : "red",
              fontWeight: 600,
              borderRadius: "6px",
              fontSize: "13px",
              display: "inline-block",
            }}
          >
            {submission ? "Отправлено" : "В ожидании"}
          </span>
        );
      },
    },
    {
      key: "upload",
      title: "Загрузить д/з",
      width: "220px",
      isButton: true,
      render: (value: string, row: HomeWorkTableItem) => {
        const submission = getSubmissionForHomework(row.homeworkId);

        return (
          <div style={{ display: "flex", gap: "10px", flexDirection: "row" }}>
            {!submission ? (
              <button
                onClick={() => handleOpenUploadModal(row)}
                className={styles.upload__button}
                title="Загрузить домашнее задание"
              >
                <UploadIcon />
              </button>
            ) : (
              <div style={{ display: "flex", gap: "30px" }}>
                <button
                  onClick={() => handleOpenSubmissionModal(row, submission)}
                  className={styles.upload__button}
                  title="Просмотреть загруженное задание"
                >
                  <UploadIcon />
                </button>
                <button
                  onClick={() => handleOpenUploadModal(row, submission, true)}
                  className={styles.upload__button}
                  title="Редактировать задание"
                >
                  <EditPen />
                </button>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className={classNames(styles.homework__container, "container")}>
      <div className={styles.homework__content}>
        <div className={styles.homework__title}>
          <h3>Домашнее задание</h3>
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
            <Table columns={homeWorkColumns} data={tableData} emptyMessage="" />
          </div>
        )}

        <HomeworkTaskModal
          isOpen={taskModal.isOpen}
          onClose={taskModal.closeModal}
          data={taskModal.data}
        />
        <LessonInfoModal
          isOpen={lessonModal.isOpen}
          onClose={lessonModal.closeModal}
          data={lessonModal.data}
        />
        <HomeworkSubmissionModal
          isOpen={submissionModal.isOpen}
          onClose={submissionModal.closeModal}
          data={submissionModal.data}
          modalLinkClass={styles.modal__link}
        />
        <HomeworkUploadModal
          isOpen={uploadModal.isOpen}
          onClose={uploadModal.closeModal}
          data={uploadModal.data}
        />
        <ProfileModal
          isOpen={noteModal.open}
          onClose={() => setNoteModal({ open: false, note: null })}
          title="Примечание от учителя"
          size="md"
        >
          <div>
            <h4>Комментарий:</h4>
            <TextArea readOnly fullWidth value={noteModal.note || ""} />
          </div>
        </ProfileModal>
      </div>
    </div>
  );
}
