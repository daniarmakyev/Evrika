import React from "react";
import Table from "@components/Table";
import classNames from "classnames";
import styles from "./styles.module.scss";
import ProfileModal from "@components/ProfileModal";
import TextArea from "@components/Fields/TextAreaField";
import Pagination from "@components/Pagination";
import { useGetStudentHomeworkGroupIdQuery } from "src/store/admin/students/students";
import type { HomeworkItem } from "src/consts/types";
import TableSkeleton from "@components/TableSkeleton/TableSkeleton";
interface AttendanceProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: number | null | undefined;
  userId: number | null | undefined;
}
const Homework: React.FC<AttendanceProps> = ({
  isOpen,
  onClose,
  groupId,
  userId,
}) => {
  const [noteModal, setNoteModal] = React.useState<{
    open: boolean;
    note: string | null;
  }>({ open: false, note: null });
  const [currentPage, setCurrentPage] = React.useState(1);
  const size = 20;
  const { data, isLoading, error, refetch } = useGetStudentHomeworkGroupIdQuery(
    {
      user_id: userId,
      group_id: groupId,
      page: currentPage,
      size,
    }
  );
  console.log(data, "HomeworkData");
  const getSubmissionForHomework = (
    homeworkId: number
  ): HomeworkItem | undefined => {
    return data?.items.find(
      (submission) => submission.homework_id === homeworkId
    );
  };
  const homeWorkColumns = [
    {
      key: "content",
      title: "Задание",
      width: "220px",
      render: (value: string) => {
        return (
          <span>
            {value.length > 50 ? value.substring(0, 50) + "..." : value}
          </span>
        );
      },
    },
    {
      key: "review",
      title: "Примечание",
      width: "180px",
      isButton: true,
      render: (_: string, row: HomeworkItem) => {
        const submission = getSubmissionForHomework(row.homework_id);
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
      key: "submitted-at",
      title: "Статус",
      width: "140px",
      render: (value: string) => {
        return (
          <span
            className={classNames(styles.status, {
              [styles.active]: value,
              [styles.inactive]: !value,
            })}
          >
            {value ? "Отправлено" : "В ожидании"}
          </span>
        );
      },
    },
  ];

  if (error) {
    return (
      <div className={styles.errorMessage}>
        <p>Произошла ошибка при загрузке личную информацию студента.</p>
        <pre>{JSON.stringify(error, null, 2)}</pre>
        <button onClick={() => refetch()} className={styles.retryButton}>
          Повторить попытку
        </button>
      </div>
    );
  }
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
            {isLoading ? (
              <TableSkeleton />
            ) : (
              <Table
                columns={homeWorkColumns}
                data={data?.items}
                emptyMessage="Нет данных о домашнем задании по данной группе"
              />
            )}
          </div>

          {data?.pagination && data.pagination.total_pages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={data?.pagination.total_pages}
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
        </div>
      </div>
    </ProfileModal>
  );
};

export default Homework;
