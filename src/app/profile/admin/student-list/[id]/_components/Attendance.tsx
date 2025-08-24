import React from "react";
import Table from "@components/Table";
import TableSkeleton from "@components/TableSkeleton/TableSkeleton";
import classNames from "classnames";
import styles from "./styles.module.scss";
import ProfileModal from "@components/ProfileModal";
import { useGetAttendanceStudentQuery } from "src/store/attendance/attendance";
interface AttendanceProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: number | null;
  userId: number | null|undefined;
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
  const attendanceColumns = [
    {
      key: "group",
      title: "Группа",
      width: "230px",
    },
    {
      key: "date",
      title: "Дата",
      width: "220px",
      isButton: false,
      render: (value: string) => {
        return (
          <span>
            {value.length > 50 ? value.substring(0, 50) + "..." : value}
          </span>
        );
      },
    },
    {
      key: "time",
      title: "Время",
      width: "220px",
      isButton: false,
      render: (value: string) => {
        return (
          <span>
            {value.length > 50 ? value.substring(0, 50) + "..." : value}
          </span>
        );
      },
    },
    {
      key: "lesson",
      title: "Урок",
      width: "180px",
      render: (value: string) => {
        return (
          <span>
            {value.length > 50 ? value.substring(0, 50) + "..." : value}
          </span>
        );
      },
    },

    {
      key: "status",
      title: "Статус",
      width: "140px",
      render: (value: string) => {
        const translatedStatus =
          value === "attended"
            ? "Присутсвовал"
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
