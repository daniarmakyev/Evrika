import React from "react";
import Table from "@components/Table";
import classNames from "classnames";
import styles from "./styles.module.scss";
import ProfileModal from "@components/ProfileModal";
interface AttendanceProps {
  isOpen: boolean;
  onClose: () => void;
  groupName: string|null;
}
const Attendance : React.FC<AttendanceProps> = ({ isOpen, onClose, groupName }) => {
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
            ? "Присутствовал"
            : value === "absent"
            ? "Не присутствовал"
            : "—";
        const color =
          value === "attended" ? "green" : value === "absent" ? "red" : "gray";
        return <span style={{ color }}>{translatedStatus}</span>;
      },
    },
  ];
  const tableData = [
    {
      id: 1,
      group: "Английский A1-0925",
      lesson: "Чтение",
      date: "09.09.2025",
      time: "09.11.2025",
      status: "attended",
    },
    {
      id: 2,
      group: "Английский A1-0925",
      lesson: "Чтение",
      date: "09.09.2025",
      time: "09.11.2025",
      status: "attended",
    },
  ].filter((item) => item.group === groupName)

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
            <Table
              columns={attendanceColumns}
              data={tableData}
              emptyMessage="Нет данных о посещаемости"
            />
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
