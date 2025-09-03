"use client";
import { useCallback, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import Table from "@components/Table";
import ViewIcon from "@icons/upload-file.svg";
import Close from "@icons/close.svg";
import classNames from "classnames";
import { useAppDispatch, useAppSelector } from "src/store/store";
import { getStudentHomeWorkByTeacher } from "src/store/lesson/lesson.action";
import { $apiPrivate } from "src/consts/api";
import { HomeworkTask, LessonListItem, GroupDetail } from "src/consts/types";
import { useModal } from "@context/ModalContext";
import { HomeworkTaskModal } from "@components/HomeworkModals";
import ProfileModal from "@components/ProfileModal";
import Pagination from "@components/Pagination"; // Import Pagination component
import { clearError } from "src/store/lesson/lesson.slice";
import StudentHomeworkViewModal from "./StudentHomeworkViewModal";
import { useParams } from "next/navigation";

interface StudentHomeworkTableItem {
  id: number;
  group: string;
  lesson: string;
  task: string;
  note: string;
  submittedAt: string;
  homeworkId: number;
  lessonId: number;
  groupId: number;
  homeworkData: HomeworkTask;
  lessonData: LessonListItem;
  submissionData: {
    id: number;
    homework_id: number;
    student_id: number;
    file_path: string | null;
    content: string;
    submitted_at: string;
    review: {
      id: number;
      comment: string;
    } | null;
  };
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

export default function StudentProfileByTeacher() {
  const dispatch = useAppDispatch();
  const { studentHomeworks, loading, error } = useAppSelector(
    (state) => state.lesson
  );
  const [tableData, setTableData] = useState<StudentHomeworkTableItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingHomeworks, setLoadingHomeworks] = useState<Set<number>>(
    new Set()
  );
  const [dataCache, setDataCache] = useState<
    Map<
      number,
      {
        homework: HomeworkTask;
        lesson: LessonListItem;
        group: GroupDetail;
      }
    >
  >(new Map());

  const [currentPage, setCurrentPage] = useState(1);

  const params = useParams();
  const studentId = params.id ? Number(params.id) : null;

  const taskModal = useModal<HomeworkTask>("task");
  const viewModal = useModal<{
    homework: StudentHomeworkTableItem;
  }>("view");

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
    if (studentId) {
      dispatch(
        getStudentHomeWorkByTeacher({
          userId: studentId,
          page: currentPage,
          size: 1,
        })
      );
    }
  }, [dispatch, studentId, currentPage]);

  const fetchHomeworkDetails = useCallback(
    async (homeworkId: number) => {
      if (dataCache.has(homeworkId) || loadingHomeworks.has(homeworkId)) {
        return dataCache.get(homeworkId);
      }

      setLoadingHomeworks((prev) => new Set(prev).add(homeworkId));

      try {
        const homeworkResponse = await $apiPrivate.get(
          `/homeworks/${homeworkId}`
        );
        const homeworkData = homeworkResponse.data;

        const lessonResponse = await $apiPrivate.get(
          `/lessons/${homeworkData.lesson_id}`
        );
        const lessonData = lessonResponse.data;

        const groupResponse = await $apiPrivate.get(
          `/group-students/${lessonData.group_id}`
        );
        const groupData = groupResponse.data;

        const result = {
          homework: {
            id: homeworkData.id,
            deadline: homeworkData.deadline,
            description: homeworkData.description,
            file_path: homeworkData.file_path,
          },
          lesson: lessonData,
          group: groupData,
        };

        setDataCache((prev) => new Map(prev).set(homeworkId, result));
        return result;
      } catch (error) {
        console.error(
          `Ошибка при получении данных для домашнего задания ${homeworkId}:`,
          error
        );
        return null;
      } finally {
        setLoadingHomeworks((prev) => {
          const newSet = new Set(prev);
          newSet.delete(homeworkId);
          return newSet;
        });
      }
    },
    [dataCache, loadingHomeworks]
  );

  useEffect(() => {
    const processHomeworks = async () => {
      if (studentHomeworks?.items && studentHomeworks.items.length > 0) {
        const promises = studentHomeworks.items.map(async (submission) => {
          const details = await fetchHomeworkDetails(submission.homework_id);

          if (details) {
            return {
              id: submission.id,
              group: details.group.name,
              lesson: details.lesson.name,
              task: details.homework.description,
              note: submission.review?.comment || "",
              submittedAt: new Date(
                submission.submitted_at
              ).toLocaleDateString(),
              homeworkId: submission.homework_id,
              lessonId: details.lesson.id,
              groupId: details.group.id,
              homeworkData: details.homework,
              lessonData: details.lesson,
              submissionData: submission,
            };
          }
          return null;
        });

        const results = await Promise.all(promises);
        const validResults = results.filter(
          (item): item is StudentHomeworkTableItem => item !== null
        );
        setTableData(validResults);
      } else {
        setTableData([]);
      }
    };

    processHomeworks();
  }, [studentHomeworks, dataCache, fetchHomeworkDetails]);

  const handleOpenTaskModal = (homework: StudentHomeworkTableItem) => {
    if (homework?.homeworkData) {
      taskModal.openModal(homework.homeworkData);
    }
  };

  const handleOpenViewModal = (homework: StudentHomeworkTableItem) => {
    if (homework) {
      viewModal.openModal({ homework });
    }
  };

  const handleDismissError = () => {
    setErrorMessage(null);
    dispatch(clearError());
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const studentHomeworkColumns = [
    {
      key: "group",
      title: "Группа",
      width: "180px",
    },
    {
      key: "lesson",
      title: "Урок",
      width: "200px",
    },
    {
      key: "task",
      title: "Задание",
      width: "220px",
      isButton: true,
      render: (value: string, row: StudentHomeworkTableItem) => {
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
      render: (value: string) => {
        if (value && value.trim()) {
          return (
            <button
              className={styles.table__button}
              style={{
                color: "#8399ff",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => setNoteModal({ open: true, note: value })}
            >
              {value.length > 30 ? value.substring(0, 30) + "..." : value}
            </button>
          );
        }
        return <span>-</span>;
      },
    },
    {
      key: "submittedAt",
      title: "Дата отправки",
      width: "140px",
    },
    {
      key: "view",
      title: "Открыть д/з",
      width: "140px",
      isButton: true,
      render: (value: string, row: StudentHomeworkTableItem) => {
        return (
          <button
            onClick={() => handleOpenViewModal(row)}
            className={styles.upload__button}
            title="Просмотреть домашнее задание"
          >
            <ViewIcon />
          </button>
        );
      },
    },
  ];

  const pagination = studentHomeworks?.pagination;

  return (
    <div className={classNames(styles.homework__container, "container")}>
      <div className={styles.homework__content}>
        <div className={styles.homework__header}>
          <h3 className={styles.homework__title}>Домашние задания студента</h3>
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

        {loading ? (
          <TableSkeleton />
        ) : (
          <div className={styles.homework__table}>
            <Table
              columns={studentHomeworkColumns}
              data={tableData}
              emptyMessage=""
            />
          </div>
        )}

        {pagination && pagination.total_pages > 1 && (
          <div className={styles.homework__pagination}>
            <Pagination
              totalPages={pagination.total_pages}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
            />
          </div>
        )}

        <HomeworkTaskModal
          isOpen={taskModal.isOpen}
          onClose={taskModal.closeModal}
          data={taskModal.data}
        />

        <StudentHomeworkViewModal
          isOpen={viewModal.isOpen}
          onClose={viewModal.closeModal}
          data={viewModal.data}
          modalLinkClass={styles.modal__link}
        />

        <ProfileModal
          isOpen={noteModal.open}
          onClose={() => setNoteModal({ open: false, note: null })}
          title="Примечание от учителя"
          size="md"
        >
          <div style={{ padding: 20, fontSize: 16, whiteSpace: "pre-line" }}>
            {noteModal.note}
          </div>
        </ProfileModal>
      </div>
    </div>
  );
}
