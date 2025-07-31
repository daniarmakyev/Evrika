"use client";
import classNames from "classnames";
import styles from "./styles.module.scss";
import Table from "@components/Table";
import ProfileModal from "@components/ProfileModal";
import Pagination from "@components/Pagination"; // Import the Pagination component
import { useModal } from "@context/ModalContext";
import { useAppDispatch, useAppSelector } from "src/store/store";
import { useEffect, useState } from "react";
import { getGroup, getGroupById } from "src/store/user/user.action";
import { GroupType } from "src/consts/types";
import Link from "next/link";
import LoadingSpinner from "@components/Ui/LoadingSpinner";

export default function Groups() {
  const groupModal = useModal<GroupType>("groups");
  const { groups, group, loading, error, groupLoading } = useAppSelector(
    (state) => state.user
  );
  const dispatch = useAppDispatch();

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getGroup({ page: currentPage, size: 2 }));
  }, [dispatch, currentPage, ]);

  useEffect(() => {
    if (groupModal.isOpen && groupModal.data?.id) {
      dispatch(getGroupById(groupModal.data.id));
    }
  }, [groupModal.isOpen, groupModal.data?.id, dispatch]);

  const groupsArray = groups?.groups || [];
  const pagination = groups?.pagination;

  const groupsTableData = groupsArray.map((g) => ({
    group: g.name,
    time: g.start_date && g.end_date ? `${g.start_date} — ${g.end_date}` : "",
    count: g.student_count || 0,
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const currentStudents = group?.students || [];

  return (
    <div className={styles.groups}>
      <div className={classNames(styles.groups__container, "container")}>
        <div className={styles.groups__content}>
          <div className={styles.groups__header}>
            <h2 className={styles.groups__title}>Группы</h2>
          </div>

          <Table
            columns={groupsColums}
            data={groupsTableData}
            emptyMessage="Нет групп"
          />

          {pagination && pagination.total_pages > 1 && (
            <div className={styles.groups__pagination}>
              <Pagination
                totalPages={pagination.total_pages}
                currentPage={currentPage}
                handlePageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>

      <ProfileModal
        isOpen={groupModal.isOpen}
        onClose={groupModal.closeModal}
        title={groupModal.data ? `Группа: ${groupModal.data.name}` : "Группа"}
        size="lg"
      >
        {!groupLoading ? (
          <div className={styles.students}>
            <header className={styles.groups__header}>
              <h4>ФИО</h4>
              <h4>Действие</h4>
            </header>

            <div className={styles.students__list}>
              {loading ? (
                <div className={styles.students__loading}>
                  Загрузка студентов...
                </div>
              ) : error ? (
                <div className={styles.students__error}>
                  Ошибка загрузки: {error}
                </div>
              ) : currentStudents.length > 0 ? (
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
        ) : (
          <div className={styles.students__loading}>
            <LoadingSpinner />
            <span>Загрузка групп...</span>
          </div>
        )}
      </ProfileModal>
    </div>
  );
}
