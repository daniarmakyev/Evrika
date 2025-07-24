"use client";
import classNames from "classnames";
import styles from "./styles.module.scss";
import Table from "@components/Table";
import ProfileModal from "@components/ProfileModal";
import { useModal } from "@context/ModalContext";

export interface GroupCardData {
  group: string;
  time: string;
  count: number;
}

interface Student {
  id: number;
  name: string;
}

export default function Groups() {
  const groupModal = useModal<GroupCardData>("groups");

  const groupsData = [
    {
      group: "Испанский-0921-01-B1",
      time: "10:00 - 12:00",
      count: 18,
    },
    {
      group: "Английский-0921-01-B1",
      time: "13:00 - 15:00",
      count: 22,
    },
    {
      group: "Русский-0921-01-B1",
      time: "15:30 - 17:30",
      count: 15,
    },
  ];

  const studentsData: { [key: string]: Student[] } = {
    "Испанский-0921-01-B1": [
      { id: 1, name: "Иванов Иван Иванович" },
      { id: 2, name: "Петров Петр Петрович" },
      { id: 3, name: "Сидоров Сидор Сидорович" },
      { id: 4, name: "Кузнецова Анна Владимировна" },
      { id: 5, name: "Смирнов Александр Николаевич" },
    ],
    "Английский-0921-01-B1": [
      { id: 6, name: "Козлов Михаил Сергеевич" },
      { id: 7, name: "Новикова Елена Андреевна" },
      { id: 8, name: "Волков Дмитрий Олегович" },
      { id: 9, name: "Морозова Ольга Ивановна" },
    ],
    "Русский-0921-01-B1": [
      { id: 10, name: "Лебедев Артем Викторович" },
      { id: 11, name: "Соколова Мария Алексеевна" },
      { id: 12, name: "Павлов Роман Дмитриевич" },
    ],
  };

  const groupsColums = [
    {
      key: "group",
      title: "Группа",
      width: "230px",
    },
    {
      key: "time",
      title: "Время",
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
      render: (_value: unknown, row: GroupCardData) => {
        return (
          <button
            className={styles.table__button}
            onClick={() => {
              groupModal.openModal(row);
            }}
          >
            Открыть
          </button>
        );
      },
    },
  ];

  const handleOpenProfile = (studentId: number, studentName: string) => {
    console.log(`Открыть профиль студента: ${studentName} (ID: ${studentId})`);
  };

  const currentStudents = groupModal.data?.group
    ? studentsData[groupModal.data.group] || []
    : [];

  return (
    <div className={styles.groups}>
      <div className={classNames(styles.groups__container, "container")}>
        <div className={styles.groups__content}>
          <h2 className={styles.groups__title}>Группы</h2>
          <Table columns={groupsColums} data={groupsData} emptyMessage="" />
        </div>
      </div>
      <ProfileModal
        isOpen={groupModal.isOpen}
        onClose={groupModal.closeModal}
        title={groupModal.data ? `Группа: ${groupModal.data.group}` : "Группа"}
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
                  <span className={styles.student__name}>{student.name}</span>
                  <button
                    className={styles.student__button}
                    onClick={() => handleOpenProfile(student.id, student.name)}
                  >
                    Открыть
                  </button>
                </div>
              ))
            ) : (
              <div className={styles.students__empty}>
                Студенты не найдены
                <br />
                <small>Группа: {groupModal.data?.group || "не выбрана"}</small>
              </div>
            )}
          </div>
        </div>
      </ProfileModal>
    </div>
  );
}
