import React from "react";
import Table from "@components/Table";
import classNames from "classnames";
import styles from "./styles.module.scss";
import ProfileModal from "@components/ProfileModal";
interface AttendanceProps {
  isOpen: boolean;
  onClose: () => void;
 
}
const Homework: React.FC<AttendanceProps> = ({
  isOpen,
  onClose,
}) => {
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
      render: (value: string) => {
        return (
          <button
            // onClick={() => handleOpenLessonModal(row)}
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
      render: (value: string) => {
        return (
          <button
            // onClick={() => handleOpenTaskModal(row)}
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
     render: () => {
        return (
          <button
            // onClick={() => handleOpenTaskModal(row)}
            className={styles.table__button}
          >
            <span>
            Посмотреть
            </span>
          </button>
        );
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
      render: (value: string) => {
        const isSubmitted = value === "submitted";
        return (
          <span
            style={{
              color: isSubmitted ? "green" : "red",
              fontWeight: 600,
              borderRadius: "6px",
              fontSize: "13px",
              display: "inline-block",
            }}
          >
            {isSubmitted? "Отправлено" : "В ожидании"}
          </span>
        );
      },
    },
  ];
  const tableData = [
  {
    id: 1,
    group: "Английский A1-0925",
    lesson: "Чтение",
    task: "Прочитать текст №3",
    note: "Обратить внимание на произношение",
    deadline: "15.09.2025",
    status: "submitted"
  },
  {
    id: 2,
    group: "Английский A1-0925",
    lesson: "Письмо",
    task: "Написать эссе",
    note: "Использовать лексику урока 5",
    deadline: "20.09.2025",
    status: "waiting"
  }
];
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
            <Table
              columns={homeWorkColumns}
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

export default Homework;
