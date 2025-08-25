import React from "react";
import Table from "@components/Table";
import classNames from "classnames";
import styles from "./styles.module.scss";
import Attendance from "./Attendance";
import Homework from "./Homework";
import type { Course2 } from "src/consts/types";

const StudentGroups: React.FC<{
  groups: Course2[];
  userId: number | null | undefined;
}> = ({ groups, userId }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedGroup, setSelectedGroup] = React.useState<number | null>(null);
  const [isHomeworkOpen, setIsHomeworkOpen] = React.useState(false);
  const [selectedHomeworkGroup, setSelectedHomeworkGroup] = React.useState<
    number | null
  >(null);
  const homeWorkColumns = [
    {
      key: "name",
      title: "Группа",
      width: "230px",
    },
    {
      key: "start_date",
      title: "Дата начала",
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
      key: "end_date",
      title: "Дата окончания",
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
      key: "progress",
      title: "Успеваемость",
      width: "220px",
      isButton: true,
      render: (_: string, row: Course2) => {
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2px",
              justifyContent: "flex-start",
              alignItems: "flex-start",
            }}
          >
            <button
              onClick={() => {
                setSelectedGroup(row.id);
                setIsModalOpen(true);
              }}
            >
              Посещаемость
            </button>
            <button
              onClick={() => {
                setSelectedHomeworkGroup(row.id);
                setIsHomeworkOpen(true); // Homework
              }}
            >
              Домашние задание
            </button>
          </div>
        );
      },
    },

    {
      key: "is_active",
      title: "Статус",
      width: "140px",
      render: (value: string) => {
        return (
          <div
            className={classNames(styles.status, {
              [styles.active]: value,
              [styles.inactive]: !value,
            })}
          >
            {value ? "Активная" : "Не активная"}
          </div>
        );
      },
    },
  ];
  return (
    <div className={classNames(styles.homework__container)}>
      <div className={styles.homework__content}>
        <div className={styles.homework__title}>
          <h3>Группы</h3>
        </div>

        <div className={styles.homework__table}>
          <Table
            columns={homeWorkColumns}
            data={groups}
            emptyMessage="Нет данных о группе"
          />
        </div>
      </div>
      <Attendance
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        groupId={selectedGroup}
        userId={userId}
      />
      <Homework
        isOpen={isHomeworkOpen}
        onClose={() => setIsHomeworkOpen(false)}
        groupId={selectedHomeworkGroup}
        userId={userId}
      />
    </div>
  );
};

export default StudentGroups;
