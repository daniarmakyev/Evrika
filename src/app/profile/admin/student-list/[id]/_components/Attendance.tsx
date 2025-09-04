import React from "react";
import Table from "@components/Table";
import TableSkeleton from "@components/TableSkeleton/TableSkeleton";
import classNames from "classnames";
import { formatTimeShedule } from "src/consts/utilits";
import styles from "./styles.module.scss";
import ProfileModal from "@components/ProfileModal";
import { useGetAttendanceStudentQuery } from "src/store/attendance/attendance";
interface AttendanceProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: number | null;
  userId: number | null | undefined;
}

interface Lesson {
  id: number;
  day: string;
  lesson_start: string;
  lesson_end: string;
  name: string;
}

interface AttendanceRecord {
  id: number;
  created_at: string;
  student_id: number;
  status: "attended" | "absent" | string;
  lesson: Lesson;
}
const Attendance: React.FC<AttendanceProps> = ({
  isOpen,
  onClose,
  groupId,
  userId,
}) => {
  const user_id = userId?.toString() ?? null;

  const { data, isLoading, isError, error, refetch } =
    useGetAttendanceStudentQuery({ user_id });
  const attendanceForGroup =
    data?.attendance_groups.find((g) => g.group.id === groupId)?.attendance ??
    [];
  console.log(attendanceForGroup, "GROUP", data);
  const attendanceColumns: {
    key: string;
    title: string;
    width: string;
    render?: (value: string, row: AttendanceRecord) => React.ReactNode;
  }[] = [
    {
      key: "lesson.day",
      title: "Дата",
      width: "220px",
      render: (_: string, row: AttendanceRecord) => {
        const date = row.lesson?.day ?? "—";
        return <span>{date}</span>;
      },
    },
    {
      key: "time",
      title: "Время",
      width: "220px",
      render: (_: string, row: AttendanceRecord) => {
        const start = row.lesson?.lesson_start
          ? formatTimeShedule(row.lesson.lesson_start)
          : "";
        const end = row.lesson?.lesson_end
          ? formatTimeShedule(row.lesson.lesson_end)
          : "";
        return <span>{start && end ? `${start} - ${end}` : "—"}</span>;
      },
    },
    {
      key: "lesson.name",
      title: "Урок",
      width: "180px",
      render: (_: string, row: AttendanceRecord) => {
        const lessonName = row.lesson?.name ?? "—";
        return <span>{lessonName}</span>;
      },
    },
    {
      key: "status",
      title: "Статус",
      width: "140px",
      render: (value: AttendanceRecord["status"]) => {
        const translatedStatus =
          value === "attended"
            ? "Присутствовал"
            : value === "absent"
            ? "Не присутствовал"
            : "—";

        return (
          <span
            className={classNames(styles.status, {
              [styles.active]: value === "attended",
              [styles.inactive]: value === "absent",
              [styles.unknowActive]: value !== "absent" && value !== "attended",
            })}
          >
            {translatedStatus}
          </span>
        );
      },
    },
  ];
  return (
    <ProfileModal
      isOpen={isOpen}
      onClose={onClose}
      title="Посещаемость"
      size="xl"
    >
      <div className={classNames(styles.homework__container)}>
        <div className={styles.homework__content}>
          <div className={styles.homework__table}>
            {isLoading ? (
              <TableSkeleton />
            ) : isError ? (
              <div className={styles.errorMessage}>
                <p>Произошла ошибка при загрузке посещаемости.</p>
                <pre>{JSON.stringify(error, null, 2)}</pre>
                <button
                  onClick={() => refetch()}
                  className={styles.retryButton}
                >
                  Повторить попытку
                </button>
              </div>
            ) : (
              <Table
                columns={attendanceColumns}
                data={attendanceForGroup}
                emptyMessage="Нет данных о посещаемости"
              />
            )}
          </div>

          {/* {data?.pagination && data.pagination.total_pages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={data?.pagination.total_pages}
            handlePageChange={setCurrentPage}
          />
        )} */}
        </div>
      </div>
    </ProfileModal>
  );
};

export default Attendance;
