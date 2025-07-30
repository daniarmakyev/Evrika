"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import styles from "./styles.module.scss";
import Table from "@components/Table";
import TableSkeleton from "@components/TableSkeleton/TableSkeleton";
import classNames from "classnames";
import { useGetAttendanceStudentQuery } from "src/store/attendance/attendance";
import Pagination from "@components/Pagination";
import { formatTimeShedule } from "src/consts/utilits";
interface HomeWorkTableItem {
  id: number;
  group: string;
  lesson: string;
  date: string;
  time: string;
  status: string;
}
export default function AttendanceStudent() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [currentPage, setCurrentPage] = useState(1);
  const size = 5; // items per page

  console.log(id);

  const { data, error, isLoading } = useGetAttendanceStudentQuery({
    user_id: id,
    page: currentPage,
    size,
  });
  console.log("ATTENDANCE", data);
  const attendanceData: HomeWorkTableItem[] = data?.attendance_groups?.length
    ? data.attendance_groups.flatMap((group) =>
        group.attendance.map((att) => ({
          id: att.id,
          group: group.group.name,
          lesson: att.lesson.name,
          date: att.lesson.day,
          time: `${formatTimeShedule(
            att.lesson.lesson_start
          )} - ${formatTimeShedule(att.lesson.lesson_end)}`,
          status: att.status,
        }))
      )
    : [
        {
          id: 0,
          group: "—",
          lesson: "—",
          date: "—",
          time: "—",
          status: "absent",
        },
      ];

  const homeWorkColumns = [
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

  return (
    <div className={classNames(styles.homework__container, "container")}>
      <div className={styles.homework__content}>
        <div className={styles.homework__title}>
          <h3>Посещаемость</h3>
        </div>
        {/* {errorMessage && (
          <div className={styles.errorNotification}>
            <span>{errorMessage}</span>
            <button
              onClick={handleDismissError}
              className={styles.dismissButton}
            >
              <Close />
            </button>
          </div>
        )} */}

        {isLoading ? (
          <TableSkeleton />
        ) : (
          <div className={styles.homework__table}>
            <Table
              columns={homeWorkColumns}
              data={attendanceData}
              emptyMessage="Нет данных о посещаемости"
            />
          </div>
        )}
        {data?.pagination && data.pagination.total_pages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={data?.pagination.total_pages}
            handlePageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
