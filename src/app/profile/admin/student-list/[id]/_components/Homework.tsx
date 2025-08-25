import React, { useEffect, useMemo, useState } from "react";
import Table from "@components/Table";
import classNames from "classnames";
import styles from "./styles.module.scss";
import ProfileModal from "@components/ProfileModal";
import TextArea from "@components/Fields/TextAreaField";
import Pagination from "@components/Pagination";
import { useAppDispatch, useAppSelector } from "src/store/store";
import { getLessons } from "src/store/lesson/lesson.action";
import type {
  HomeworkItem,
  HomeworkTask,
  LessonListItem,
} from "src/consts/types";
import TableSkeleton from "@components/TableSkeleton/TableSkeleton";
import { useGetStudentHomeworkGroupIdQuery } from "src/store/admin/students/students";

interface AttendanceProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: number | null | undefined;
  userId: number | null | undefined;
}

interface HomeWorkTableItem {
  id: number;
  group: string;
  lesson: string;
  task: string;
  deadline: string;
  homeworkId: number;
  lessonId: number;
  homeworkData: HomeworkTask;
}

const Homework: React.FC<AttendanceProps> = ({
  isOpen,
  onClose,
  groupId,
  userId,
}) => {
  const dispatch = useAppDispatch();
  const { lessons, loading, error } = useAppSelector((state) => state.lesson);

  const [lessonState, setLessonState] = useState<LessonListItem[]>([]);
  const [tableData, setTableData] = useState<HomeWorkTableItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [noteModal, setNoteModal] = useState<{
    open: boolean;
    note: string | null;
  }>({ open: false, note: null });

  const [taskModal, setTaskModal] = useState<{
    open: boolean;
    task: HomeworkTask | null;
  }>({ open: false, task: null });

  const [lessonModal, setLessonModal] = useState<{
    open: boolean;
    lesson: LessonListItem | null;
  }>({ open: false, lesson: null });

  const [submissionModal, setSubmissionModal] = useState<{
    open: boolean;
    submission: HomeworkItem | null;
  }>({ open: false, submission: null });

  useEffect(() => {
    if (isOpen && groupId) {
      dispatch(getLessons(groupId));
    }
  }, [dispatch, isOpen, groupId]);

  const { data: homeworkSubmissionsData } = useGetStudentHomeworkGroupIdQuery(
    {
      user_id: userId!,
      group_id: groupId!,
      page: 1,
      size: 100,
    },
    { skip: !userId || !groupId || !isOpen }
  );

  const homeworkState = useMemo(() => {
    return homeworkSubmissionsData?.items ?? [];
  }, [homeworkSubmissionsData]);

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
            ? new Date(lesson.homework.deadline).toLocaleDateString("ru-RU")
            : "",
          homeworkId: lesson.homework?.id || 0,
          lessonId: lesson.id,
          homeworkData: lesson.homework!,
        }));

      setTableData(formattedData);
    }
  }, [lessonState, homeworkState]);

  const getSubmissionForHomework = (homeworkId: number) => {
    return homeworkState.find(
      (submission) =>
        submission.homework_id === homeworkId &&
        submission.student_id === userId
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Не указан";
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleOpenTaskModal = (homework: HomeWorkTableItem) => {
    setTaskModal({ open: true, task: homework.homeworkData });
  };

  const handleOpenLessonModal = (homework: HomeWorkTableItem) => {
    const lesson = lessonState.find((l) => l.id === homework.lessonId);
    if (lesson) {
      setLessonModal({ open: true, lesson });
    }
  };

  const handleOpenSubmissionModal = (submission: HomeworkItem) => {
    setSubmissionModal({ open: true, submission });
  };

  const homeWorkColumns = [
    {
      key: "group",
      title: "Группа",
      width: "180px",
      render: (value: string) => <span>{value || "Не указана"}</span>,
    },
    {
      key: "lesson",
      title: "Урок",
      width: "150px",
      isButton: true,
      render: (value: string, row: HomeWorkTableItem) => {
        return (
          <button
            onClick={() => handleOpenLessonModal(row)}
            className={styles.table__button}
            title={value}
          >
            {value && value.length > 20
              ? value.substring(0, 15) + "..."
              : value || "Не указан"}
          </button>
        );
      },
    },
    {
      key: "task",
      title: "Задание",
      width: "150px",
      isButton: true,
      render: (value: string, row: HomeWorkTableItem) => {
        return (
          <button
            onClick={() => handleOpenTaskModal(row)}
            className={styles.table__button}
            title={value}
          >
            {value && value.length > 20
              ? value.substring(0, 20) + "..."
              : value || "Нет описания"}
          </button>
        );
      },
    },
    {
      key: "review",
      title: "Примечание",
      width: "140px",
      isButton: true,
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
                setNoteModal({ open: true, note: submission.review.comment })
              }
            >
              {submission.review.comment.length > 15
                ? submission.review.comment.substring(0, 15) + "..."
                : submission.review.comment}
            </button>
          );
        }
        return <span style={{ color: "#999" }}>Нет примечания</span>;
      },
    },
    {
      key: "deadline",
      title: "Срок сдачи",
      width: "110px",
      render: (value: string, row: HomeWorkTableItem) => {
        return <span>{formatDate(row.homeworkData.deadline)}</span>;
      },
    },
    {
      key: "submission",
      title: "Просмотр ДЗ",
      width: "120px",
      isButton: true,
      render: (_: string, row: HomeWorkTableItem) => {
        const submission = getSubmissionForHomework(row.homeworkId);
        if (submission) {
          return (
            <button
              onClick={() => handleOpenSubmissionModal(submission)}
              className={styles.view__button}
              title="Просмотреть отправленное ДЗ"
            >
              Просмотр
            </button>
          );
        }
        return <span style={{ color: "#999" }}>Не сдано</span>;
      },
    },
  ];

  if (error) {
    return (
      <ProfileModal
        isOpen={isOpen}
        onClose={onClose}
        title="Домашнее задание"
        size="xl"
      >
        <div className={styles.errorMessage}>
          <p>Произошла ошибка при загрузке домашних заданий.</p>
          <pre>{JSON.stringify(error, null, 2)}</pre>
          <button
            onClick={() => groupId && dispatch(getLessons(groupId))}
            className={styles.retryButton}
          >
            Повторить попытку
          </button>
        </div>
      </ProfileModal>
    );
  }

  const itemsPerPage = 10;
  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = tableData.slice(startIndex, endIndex);

  return (
    <ProfileModal
      isOpen={isOpen}
      onClose={onClose}
      title="Домашнее задание"
      size="xl"
    >
      <div className={classNames(styles.homework__container)}>
        <div className={styles.homework__content}>
          <div className={styles.homework__table}>
            {loading ? (
              <TableSkeleton />
            ) : (
              <Table
                columns={homeWorkColumns}
                data={currentItems}
                emptyMessage="Нет данных о домашнем задании по данной группе"
              />
            )}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={setCurrentPage}
            />
          )}

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

          <ProfileModal
            isOpen={taskModal.open}
            onClose={() => setTaskModal({ open: false, task: null })}
            title="Описание задания"
            size="lg"
          >
            <div className={styles.taskModal}>
              <div className={styles.taskInfo}>
                <h4>Описание задания:</h4>
                <div className={styles.taskDescription}>
                  {taskModal.task?.description || "Описание отсутствует"}
                </div>
              </div>
              <div className={styles.taskDeadline}>
                <h4>Срок сдачи:</h4>
                <span>
                  {taskModal.task?.deadline
                    ? formatDate(taskModal.task.deadline)
                    : "Не указан"}
                </span>
              </div>
              {taskModal.task?.file_path && (
                <div className={styles.taskFile}>
                  <h4>Прикрепленный файл:</h4>
                  <a
                    href={taskModal.task.file_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.fileLink}
                  >
                    Скачать файл
                  </a>
                </div>
              )}
            </div>
          </ProfileModal>

          <ProfileModal
            isOpen={lessonModal.open}
            onClose={() => setLessonModal({ open: false, lesson: null })}
            title="Информация об уроке"
            size="lg"
          >
            <div className={styles.lessonModal}>
              <div className={styles.lessonInfo}>
                <h4>Название урока:</h4>
                <span>{lessonModal.lesson?.name || "Не указано"}</span>
              </div>
              <div className={styles.lessonDescription}>
                <h4>Описание:</h4>
                <div>
                  {lessonModal.lesson?.description || "Описание отсутствует"}
                </div>
              </div>
              <div className={styles.lessonDetails}>
                <div>
                  <h4>Дата:</h4>
                  <span>{lessonModal.lesson?.day || "Не указана"}</span>
                </div>
                <div>
                  <h4>Время:</h4>
                  <span>
                    {lessonModal.lesson?.lesson_start &&
                    lessonModal.lesson?.lesson_end
                      ? `${lessonModal.lesson.lesson_start} - ${lessonModal.lesson.lesson_end}`
                      : "Не указано"}
                  </span>
                </div>
                <div>
                  <h4>Группа:</h4>
                  <span>{lessonModal.lesson?.group_name || "Не указана"}</span>
                </div>
                <div>
                  <h4>Аудитория:</h4>
                  <span>
                    {lessonModal.lesson?.classroom_name || "Не указана"}
                  </span>
                </div>
              </div>
              {lessonModal.lesson?.link && (
                <div className={styles.lessonLink}>
                  <h4>Ссылка на урок:</h4>
                  <a
                    href={lessonModal.lesson.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.lessonLinkUrl}
                  >
                    Перейти к уроку
                  </a>
                </div>
              )}
            </div>
          </ProfileModal>

          <ProfileModal
            isOpen={submissionModal.open}
            onClose={() =>
              setSubmissionModal({ open: false, submission: null })
            }
            title="Отправленное домашнее задание"
            size="lg"
          >
            <div className={styles.submissionModal}>
              <div className={styles.submissionInfo}>
                <h4>Ответ студента:</h4>
                <div className={styles.submissionContent}>
                  {submissionModal.submission?.content || "Ответ отсутствует"}
                </div>
              </div>
              <div className={styles.submissionDate}>
                <h4>Дата отправки:</h4>
                <span>
                  {submissionModal.submission?.submitted_at
                    ? formatDate(submissionModal.submission.submitted_at)
                    : "Не указана"}
                </span>
              </div>
              {submissionModal.submission?.file_path && (
                <div className={styles.submissionFile}>
                  <h4>Прикрепленный файл:</h4>
                  <a
                    href={submissionModal.submission.file_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.fileLink}
                  >
                    Скачать файл
                  </a>
                </div>
              )}
              {submissionModal.submission?.review && (
                <div className={styles.submissionReview}>
                  <h4>Комментарий учителя:</h4>
                  <div className={styles.reviewComment}>
                    {submissionModal.submission.review.comment}
                  </div>
                </div>
              )}
            </div>
          </ProfileModal>
        </div>
      </div>
    </ProfileModal>
  );
};

export default Homework;
