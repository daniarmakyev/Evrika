"use client";
import React from "react";
import TableSkeleton from "@components/TableSkeleton/TableSkeleton";
import Table from "@components/Table";
import ProfileModal from "@components/ProfileModal";
import DaysWeekSelector from "@components/DaysWeekSelector";
import LessonEditModal from "src/app/profile/schedule/LessonEditModal";
import LessonCreateModal from "src/app/profile/schedule/SheduleUploadModal";
import InputField from "@components/Fields/InputField";
import TextArea from "@components/Fields/TextAreaField";
import { useGetTeacherScheduleQuery } from "src/store/admin/teachers/teachers";
import { useParams } from "next/navigation";
import type {
  LessonShedule,
  GroupWithLessons,
  WeekSchedule,
} from "src/consts/types";
import styles from "./styles.module.scss";
import Link from "next/link";
import { formatTimeRangeShedule, getTimeInMinutes } from "src/consts/utilits";
import classNames from "classnames";
import { useModal } from "@context/ModalContext";
import { useAppDispatch } from "src/store/store";
import { getShedule } from "src/store/shedule/shedule.action";

const Schedulepage = () => {
  const params = useParams();
  const [activeDay, setActiveDay] = React.useState<keyof WeekSchedule>("MON");
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const user_id = Number(id);
  const {
    data: schedule,
    isLoading,
  } = useGetTeacherScheduleQuery({
    user_id,
  });

  // const { shedule, loading, error } = useAppSelector((state) => state.shedule);
  // const { user, groups, attendance, attendanceLoading } = useAppSelector(
  //   (state) => state.user
  // );
  // const { classrooms } = useAppSelector((state) => state.lesson);

  const dispatch = useAppDispatch();

  const lessonModal = useModal<LessonShedule>("lesson");
  const lessonEditModal = useModal<LessonShedule>("lesson-edit");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createLessonModal = useModal("create-lesson");

  const handleCreateLessonClick = () => {
    createLessonModal.openModal({});
  };

  const handleLessonClick = (lesson: LessonShedule, groupId?: number) => {
    const lessonWithGroup = { ...lesson, group_id: groupId };
    lessonEditModal.openModal(lessonWithGroup);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transformScheduleData = (entries: GroupWithLessons[] = []) => {
    return entries
      .flatMap((entry) =>
        entry.lessons.map((lesson) => ({
          group: entry.group.name,
          groupId: entry.group.id,
          time: formatTimeRangeShedule(lesson.lesson_start, lesson.lesson_end),
          teacher_name: `${lesson.teacher.first_name} ${lesson.teacher.last_name}`,
          classroom: lesson.classroom.name,
          lessons: [lesson],
          sortTime: getTimeInMinutes(lesson.lesson_start),
        }))
      )
      .sort((a, b) => a.sortTime - b.sortTime);
  };

  const handleDayChange = (day: keyof WeekSchedule) => {
    setActiveDay(day);
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
          onClick={() => handleLessonClick(lessons[0])}
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
    if (isLoading || !schedule) {
      return <TableSkeleton />;
    }

    // if (error) {
    //   return (
    //     <div className={styles.errorContainer}>
    //       <div className={styles.errorIcon}>⚠️</div>
    //       <h3 className={styles.errorTitle}>Ошибка загрузки расписания</h3>
    //       <p className={styles.errorMessage}>{(error as any)?.data}</p>
    //       <button className={styles.retryButton} onClick={() => refetch()}>
    //         <span>Попробовать снова</span>
    //       </button>
    //     </div>
    //   );
    // }

    return (
      <Table
        columns={scheduleColumns}
        data={transformScheduleData(schedule[activeDay] || [])}
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

            <button onClick={handleCreateLessonClick}>Добавить урок</button>
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

      <LessonEditModal
        isOpen={lessonEditModal.isOpen}
        onClose={lessonEditModal.closeModal}
        lesson={lessonEditModal.data}
        onSuccess={() => {
          dispatch(getShedule());
        }}
      />
      <LessonCreateModal
        isOpen={createLessonModal.isOpen}
        onClose={createLessonModal.closeModal}
        onSuccess={() => {
          dispatch(getShedule());
        }}
      />
    </div>
  );
};

export default Schedulepage;
