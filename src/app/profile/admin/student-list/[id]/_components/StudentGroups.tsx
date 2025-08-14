import React from "react";
import Table from "@components/Table";
import classNames from "classnames";
import styles from "./styles.module.scss";
import Attendance from "./Attendance";
import Homework from "./Homework";

const StudentGroups = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedGroup, setSelectedGroup] = React.useState<string | null>(null);
  const [isHomeworkOpen, setIsHomeworkOpen] = React.useState(false);
  const homeWorkColumns = [
    {
      key: "group",
      title: "Группа",
      width: "230px",
    },
    {
      key: "startDate",
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
      key: "endDate",
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
      render: (_: string, row: any) => {
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span
              onClick={() => {
                setSelectedGroup(row.group);
                setIsModalOpen(true);
              }}
            >
              Посещаемость
            </span>
            <span
              onClick={() => {
                setIsHomeworkOpen(true); // Homework
              }}
            >
              Домашние задание
            </span>
          </div>
        );
      },
    },

    {
      key: "status",
      title: "Статус",
      width: "140px",
      render: (value: string) => {
        return (
          <div
            style={{
              backgroundColor: value === "active" ? "green" : "red",
              color: "white",
              fontWeight: 600,
              borderRadius: "6px",
              fontSize: "13px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "30px",
            }}
          >
            {value === "active" ? "Активен" : "Не активен"}
          </div>
        );
      },
    },
  ];
  const tableData = [
    {
      id: 1,
      group: "Английский A1-0925",
      course: "Английский A1",
      startDate: "09.09.2025",
      endDate: "09.11.2025",
      status: "active",
    },
  ];
  return (
    <div className={classNames(styles.homework__container)}>
      <div className={styles.homework__content}>
        <div className={styles.homework__title}>
          <h3>Группы</h3>
          {/* <div style={{ width: "210px", position: "relative" }}>
              <SelectField
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                options={groupOptions}
              />
            </div> */}
        </div>

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
      <Attendance
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        groupName={selectedGroup}
      />
      <Homework
  isOpen={isHomeworkOpen}
  onClose={() => setIsHomeworkOpen(false)}

/>
    </div>
  );
};

export default StudentGroups;
