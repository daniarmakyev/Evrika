"use client";
import classNames from "classnames";
import styles from "./styles.module.scss";
import Table from "@components/Table";
import ProfileModal from "@components/ProfileModal";
import { useModal } from "@context/ModalContext";
import { useAppDispatch, useAppSelector } from "src/store/store";
import { useEffect } from "react";
import { getGroup } from "src/store/user/user.action";
import { GroupType } from "src/consts/types";
import Link from "next/link";

export default function Groups() {
  const groupModal = useModal<GroupType>("groups");
  const { groups } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getGroup("teacher"));
  }, [dispatch]);

  const groupsTableData = (groups || []).map((g) => ({
    group: g.name,
    time: g.start_date && g.end_date ? `${g.start_date} — ${g.end_date}` : "",
    count: Array.isArray(g.students) ? g.students.length : 0,
    ...g,
  }));

  const groupsColums = [
    {
      key: "group",
      title: "Группа",
      width: "230px",
    },
    {
      key: "time",
      title: "Период",
      width: "230px",
    },
    {
      key: "count",
      title: "Кол-во студентов",
      width: "230px",
    },
    {
      key: "group",
      title: "Просмотр",
      isButton: true,
      width: "140px",
      render: (
        _value: unknown,
        row: GroupType & { group: string; time: string; count: number }
      ) => (
        <button
          className={styles.table__button}
          onClick={() => groupModal.openModal(row)}
        >
          Открыть
        </button>
      ),
    },
  ];

  const handleOpenProfile = (studentId: number, studentName: string) => {
    console.log(`Открыть профиль студента: ${studentName} (ID: ${studentId})`);
  };

  const currentStudents =
    Array.isArray(groupModal.data?.students) &&
    groupModal.data.students.length > 0
      ? groupModal.data.students
      : [];

  return (
    <div className={styles.groups}>
      <div className={classNames(styles.groups__container, "container")}>
        <div className={styles.groups__content}>
          <h2 className={styles.groups__title}>Группы</h2>
          <Table
            columns={groupsColums}
            data={groupsTableData}
            emptyMessage="Нет групп"
          />
        </div>
      </div>
      <ProfileModal
        isOpen={groupModal.isOpen}
        onClose={groupModal.closeModal}
        title={groupModal.data ? `Группа: ${groupModal.data.name}` : "Группа"}
        size="lg"
      >
        <div className={styles.students}>
          <header className={styles.groups__header}>
            <h4>ФИО</h4>
            <h4>Действие</h4>
          </header>
          <div className={styles.students__list}>
            {currentStudents.length > 0 ? (
              currentStudents.map((student) => (
                <div key={student.id} className={styles.student__item}>
                  <span className={styles.student__name}>
                    {student.last_name} {student.first_name}
                  </span>
                  <Link
                  href={`/profile/homework/${student.id}`}
                    className={styles.student__button}
                    onClick={() =>
                      handleOpenProfile(
                        student.id,
                        `${student.last_name} ${student.first_name}`
                      )
                    }
                  >
                    Открыть
                  </Link>
                </div>
              ))
            ) : (
              <div className={styles.students__empty}>
                Студенты не найдены
                <br />
                <small>Группа: {groupModal.data?.name || "не выбрана"}</small>
              </div>
            )}
          </div>
        </div>
      </ProfileModal>
    </div>
  );
}
