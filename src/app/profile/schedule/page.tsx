"use client";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import DaysWeekSelector, { DayOfWeek } from "@components/DaysWeekSelector";
import classNames from "classnames";
import Table from "@components/Table";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "src/store/store";
import { getShedule } from "src/store/shedule/shedule.action";
import { getUser, getGroup } from "src/store/user/user.action";
import { LessonShedule } from "src/consts/types";
import { formatTimeRangeShedule, getTimeInMinutes } from "src/consts/utilits";
import { useModal } from "@context/ModalContext";
import ProfileModal from "@components/ProfileModal";
import InputField from "@components/Fields/InputField";
import TextArea from "@components/Fields/TextAreaField";
import LessonCreateModal from "./SheduleUploadModal";
import Close from "@icons/close.svg";
import Succes from "@icons/succes.svg";
import { getClassrooms } from "src/store/lesson/lesson.action";

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
      {[...Array(5)].map((_, index) => (
        <div key={index} className={styles.tableRowSkeletonDiv}>
          <div className={styles.skeletonCell}></div>
          <div className={styles.skeletonCell}></div>
          <div className={styles.skeletonCell}></div>
          <div className={styles.skeletonCell}></div>
          <div className={styles.skeletonCell}></div>
          <div className={styles.skeletonCell}></div>
        </div>
      ))}
    </div>
  </div>
);

export default function ProfileSchedule() {
  const [activeDay, setActiveDay] = useState<DayOfWeek>("MON");
  const [role, setRole] = useState<string | null>(null);
  const [attendanceData, setAttendanceData] = useState<{
    [key: number]: boolean;
  }>({});

  const { shedule, loading, error } = useAppSelector((state) => state.shedule);
  const { user, groups } = useAppSelector((state) => state.user);
  const { classrooms } = useAppSelector((state) => state.lesson);

  const dispatch = useAppDispatch();

  const lessonModal = useModal<LessonShedule>("lesson");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groupModal = useModal<{
    groupName: string;
    lessonId: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    students: any[];
  }>("group");
  const createLessonModal = useModal("create-lesson");

  const handleDayChange = (day: DayOfWeek) => {
    setActiveDay(day);
  };

  const handleRetry = () => {
    dispatch(getShedule());
  };

  const toggleAttendance = (studentId: number) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const mockStudentsData = [
    { id: 1, first_name: "Иван", last_name: "Иванов" },
    { id: 2, first_name: "Петр", last_name: "Петров" },
    { id: 3, first_name: "Сидор", last_name: "Сидоров" },
    { id: 4, first_name: "Анна", last_name: "Кузнецова" },
    { id: 5, first_name: "Александр", last_name: "Смирнов" },
  ];

  useEffect(() => {
    dispatch(getShedule());
    dispatch(getUser());

    const userRole = localStorage.getItem("role");
    if (userRole) {
      setRole(userRole);
      if (userRole === "admin" || userRole === "teacher") {
        dispatch(getGroup(userRole));
        dispatch(getClassrooms());
      }
    }
  }, [dispatch]);

  const handleCreateLessonClick = () => {
    if (!user) {
      dispatch(getUser());
    }
    if (!classrooms) {
      dispatch(getClassrooms());
    }
    if (!groups && role) {
      dispatch(getGroup(role));
    }

    createLessonModal.openModal({});
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transformScheduleData = (scheduleEntries: any[]) => {
    const transformedData = scheduleEntries.flatMap((entry) =>
      entry.lessons.map((lesson: LessonShedule) => ({
        group: entry.group.name,
        groupId: entry.group.id,
        time: formatTimeRangeShedule(lesson.lesson_start, lesson.lesson_end),
        teacher_name: `${
          lesson.teacher.first_name + " " + lesson.teacher.last_name
        }`,
        classroom: `${lesson.classroom.name}`,
        lessons: [lesson],
        sortTime: getTimeInMinutes(lesson.lesson_start),
      }))
    );

    return transformedData.sort((a, b) => a.sortTime - b.sortTime);
  };

  const scheduleColumns = [
    {
      key: "group",
      title: "Группа",
      width: "230px",
      isButton: role === "admin" || role === "teacher",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (value: any, rowData: any) => {
        if (role === "admin" || role === "teacher") {
          return (
            <button
              className={styles.table__button}
              onClick={() =>
                groupModal.openModal({
                  groupName: rowData.group,
                  lessonId: rowData.lessons[0]?.id || 0,
                  students: mockStudentsData,
                })
              }
            >
              {rowData.group}
            </button>
          );
        }
        return <span>{rowData.group}</span>;
      },
    },
    {
      key: "time",
      title: "Время",
      width: "150px",
    },
    {
      key: "teacher_name",
      title: "Преподаватель",
      width: "180px",
    },
    {
      key: "classroom",
      title: "Аудитория",
      width: "150px",
    },
    {
      key: "lessons",
      title: "Урок",
      width: "220px",
      isButton: true,
      render: (lessons: LessonShedule[]) => (
        <button
          className={styles.table__button}
          onClick={() => lessonModal.openModal(lessons[0])}
        >
          {lessons[0]?.name}
        </button>
      ),
    },
    {
      key: "lessons",
      title: "Ссылка",
      width: "220px",
      isLink: true,
      render: (lessons: LessonShedule[]) => (
        <Link href={lessons[0]?.link || "#"} className={styles.table__link}>
          {lessons[0]?.link}
        </Link>
      ),
    },
  ];

  const renderContent = () => {
    if (loading || !shedule) {
      return <TableSkeleton />;
    }

    if (error) {
      return (
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <h3 className={styles.errorTitle}>Ошибка загрузки расписания</h3>
          <p className={styles.errorMessage}>{error}</p>
          <button className={styles.retryButton} onClick={handleRetry}>
            <span>Попробовать снова</span>
          </button>
        </div>
      );
    }

    return (
      <Table
        columns={scheduleColumns}
        data={transformScheduleData(shedule[activeDay] || [])}
        emptyMessage="Уроков нет"
        keyField="time"
      />
    );
  };

  return (
    <div className={styles.schedule}>
      <div className={classNames(styles.schedule__container, "container")}>
        <div className={styles.schedule__content}>
          <div className={styles.schedule__title}>
            <h3>Расписание занятий</h3>
            {role === "admin" || role === "teacher" ? (
              <button onClick={handleCreateLessonClick}>Добавить урок</button>
            ) : null}
          </div>

          <DaysWeekSelector
            activeDay={activeDay}
            onDayChange={handleDayChange}
          />

          {renderContent()}
        </div>
      </div>

      <ProfileModal
        isOpen={lessonModal.isOpen}
        onClose={lessonModal.closeModal}
        title={"Урок"}
        size="lg"
      >
        {lessonModal.data && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <div>
              <h4>Тема урока</h4>
              <InputField
                value={lessonModal.data.name}
                readOnly
                isShadow
                fullWidth
              />
            </div>

            <div>
              <h4>Описание</h4>
              <TextArea
                value={lessonModal.data.description}
                readOnly
                isShadow
                fullWidth
              />
            </div>

            {lessonModal.data.link && (
              <div className={styles.modal__section}>
                <h4>Ссылка на урок</h4>
                <Link
                  href={lessonModal.data.link}
                  className={styles.modal__link}
                >
                  <InputField
                    style={{ cursor: "pointer" }}
                    value={lessonModal.data.link}
                    readOnly
                    isShadow
                    fullWidth
                  />
                </Link>
              </div>
            )}
          </div>
        )}
      </ProfileModal>

      <ProfileModal
        isOpen={groupModal.isOpen}
        onClose={groupModal.closeModal}
        title={
          groupModal.data
            ? `Посещаемость: ${groupModal.data.groupName}`
            : "Посещаемость"
        }
        size="lg"
      >
        <div className={styles.students}>
          <header className={styles.groups__header}>
            <h4>ФИО студента</h4>
            <h4>Посещаемость</h4>
          </header>
          <div className={styles.students__list}>
            {groupModal.data?.students &&
            groupModal.data.students.length > 0 ? (
              groupModal.data.students.map((student) => (
                <div key={student.id} className={styles.student__item}>
                  <span className={styles.student__name}>
                    {student.first_name} {student.last_name}
                  </span>
                  <button
                    className={`${styles.attendance__button} ${
                      attendanceData[student.id]
                        ? styles.attendance__button_active
                        : ""
                    }`}
                    onClick={() => toggleAttendance(student.id)}
                  >
                    {attendanceData[student.id] ? (
                      <Succes />
                    ) : (
                      <Close strokeWidth={3} />
                    )}
                  </button>
                </div>
              ))
            ) : (
              <div className={styles.students__empty}>Студенты не найдены</div>
            )}
          </div>
        </div>
      </ProfileModal>

      <LessonCreateModal
        isOpen={createLessonModal.isOpen}
        onClose={createLessonModal.closeModal}
        onSuccess={() => {
          dispatch(getShedule());
        }}
      />
    </div>
  );
}
