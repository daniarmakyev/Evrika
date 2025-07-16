"use client";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import DaysWeekSelector, { DayOfWeek } from "@components/DaysWeekSelector";
import classNames from "classnames";
import Table from "@components/Table";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "src/store/store";
import { getShedule } from "src/store/shedule/shedule.action";
import { LessonShedule } from "src/consts/types";
import { formatTimeRangeShedule, getTimeInMinutes } from "src/consts/utilits";
import { useModal } from "@context/ModalContext";
import ProfileModal from "@components/ProfileModal";
import InputField from "@components/Fields/InputField";
import TextArea from "@components/Fields/TextAreaField";

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

  const { shedule, loading, error } = useAppSelector((state) => state.shedule);
  const dispatch = useAppDispatch();

  const lessonModal = useModal<LessonShedule>("lesson");

  const handleDayChange = (day: DayOfWeek) => {
    setActiveDay(day);
  };

  const handleRetry = () => {
    dispatch(getShedule());
  };

  useEffect(() => {
    dispatch(getShedule());
  }, [dispatch]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transformScheduleData = (scheduleEntries: any[]) => {
    const transformedData = scheduleEntries.flatMap((entry) =>
      entry.lessons.map((lesson: LessonShedule) => ({
        group: entry.group.name,
        time: formatTimeRangeShedule(lesson.lesson_start, lesson.lesson_end),
        teacher_name: `${
          lesson.teacher.first_name + " " + lesson.teacher.last_name
        }`,
        classroom: `${lesson.classroom.title}`,
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
    </div>
  );
}