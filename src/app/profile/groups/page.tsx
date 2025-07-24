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

export default function Groups() {
  const groupModal = useModal<GroupCardData>("groups");

  const groupsData = [
    {
      group: "Frontend 101",
      time: "10:00 - 12:00",
      count: 18,
    },
    {
      group: "Backend Basics",
      time: "13:00 - 15:00",
      count: 22,
    },
    {
      group: "UI/UX Design",
      time: "15:30 - 17:30",
      count: 15,
    },
  ];

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
      key: "check",
      title: "Просмотр",
      isButton: true,
      width: "140px",
      render: (group: GroupCardData) => {
        return (
          <button
            className={styles.table__button}
            onClick={() => groupModal.openModal(group)}
          >
            Открыть
          </button>
        );
      },
    },
  ];

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
        title={"Урок"}
        size="lg"
      >
        <header className={styles.groups__header}>
            <h4>ФИО</h4>
            <h4>Открыть профиль</h4>
        </header>
      </ProfileModal>
    </div>
  );
}
