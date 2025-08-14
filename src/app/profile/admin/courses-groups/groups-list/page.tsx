"use client";

import React, { useEffect, useState } from "react";
import classNames from "classnames";
import styles from "./styles.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Table from "@components/Table";
import SelectField from "@components/Fields/SelectField";
import EditPen from "@icons/edit-pen.svg";
import { useModal } from "@context/ModalContext";
import ProfileModal from "@components/ProfileModal";
import InputField from "@components/Fields/InputField";
import UploadIcon from "@icons/upload-file.svg";
import SearchIcon from "@icons/searchIcon.svg";
import CreateGroupModal from "./CreateModal";
import EditGroupModal from "./EditModal";
import { useAppDispatch, useAppSelector } from "src/store/store";
import {
  getGroups,
  getTeachers,
} from "src/store/courseGroup/courseGroup.action";
import { Group } from "src/consts/types";

interface GroupTableItem {
  id: number;
  name: string;
  course_name: string;
  status: string;
  teacher_name: string;
  start_date: string;
}

const TableSkeleton = () => (
  <div className={styles.tableSkeleton}>
    <div className={styles.tableHeaderSkeleton}>
      <div className={styles.skeletonHeaderCell}></div>
      <div className={styles.skeletonHeaderCell}></div>
      <div className={styles.skeletonHeaderCell}></div>
      <div className={styles.skeletonHeaderCell}></div>
    </div>
    <div className={styles.tableBodySkeleton}>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className={styles.tableRowSkeletonDiv}>
          <div className={styles.skeletonCell}></div>
          <div className={styles.skeletonCell}></div>
          <div className={styles.skeletonCell}></div>
          <div className={styles.skeletonButtonCell}></div>
        </div>
      ))}
    </div>
  </div>
);

export default function GroupsList() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { groups, loadingGroups, teachers, error } =
    useAppSelector((state) => state.groupsCourses);

  const [filteredGroups, setFilteredGroups] = useState<GroupTableItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const viewModal = useModal<Group>("view");
  const editModal = useModal<Group>("edit");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const statusOptions = [
    { value: "", label: "Все статусы" },
    { value: "active", label: "Активная" },
    { value: "archived", label: "Архивная" },
    { value: "inactive", label: "Неактивная" },
  ];

  useEffect(() => {
    dispatch(getGroups({ limit: 50, offset: 0 }));
    dispatch(getTeachers({ limit: 50, offset: 0 }));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (groups) {
      let filtered = groups;

      if (searchTerm) {
        filtered = filtered.filter((group) =>
          group.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (selectedStatus) {
        filtered = filtered.filter(
          (group) => getStatusValue(group) === selectedStatus
        );
      }

      const tableData = filtered.map((group) => ({
        id: group.id,
        name: group.name,
        course_name: group.name,
        status: getStatusText(group),
        teacher_name: `${group.teacher.first_name} ${group.teacher.last_name}`,
        start_date: group.start_date,
      }));

      setFilteredGroups(tableData);
    }
  }, [groups, searchTerm, selectedStatus]);

  const getStatusText = (group: Group) => {
    if (group.is_archived) return "Архивная";
    if (group.is_active) return "Активная";
    return "Неактивная";
  };

  const getStatusValue = (group: Group) => {
    if (group.is_archived) return "archived";
    if (group.is_active) return "active";
    return "inactive";
  };

  const handleViewGroup = (group: GroupTableItem) => {
    if (groups) {
      const fullGroup = groups.find((g) => g.id === group.id);
      if (fullGroup) {
        viewModal.openModal(fullGroup);
      }
    }
  };

  const handleEditGroup = (group: GroupTableItem) => {
    if (groups) {
      const fullGroup = groups.find((g) => g.id === group.id);
      if (fullGroup) {
        editModal.openModal(fullGroup);
      }
    }
  };

  const handleCreateGroup = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    dispatch(getGroups({ limit: 50, offset: 0 }));
  };

  const handleEditSuccess = () => {
    editModal.closeModal();
    dispatch(getGroups({ limit: 50, offset: 0 }));
  };

  const handleDismissError = () => {
    setErrorMessage(null);
  };

  const groupsColumns = [
    {
      key: "name",
      title: "Группа",
      width: "200px",
    },
    {
      key: "course_name",
      title: "Курс",
      width: "150px",
    },
    {
      key: "status",
      title: "Статус",
      width: "120px",
      render: (value: string) => (
        <span
          className={classNames(styles.status, {
            [styles.active]: value === "Активная",
            [styles.inactive]: value === "Неактивная",
            [styles.archived]: value === "Архивная",
          })}
        >
          {value}
        </span>
      ),
    },
    {
      key: "actions",
      title: "Изменить",
      width: "150px",
      isButton: true,
      render: (_: string, row: GroupTableItem) => (
        <div className={styles.actionButtons}>
          <button
            onClick={() => handleViewGroup(row)}
            className={styles.actionButton}
            title="Просмотр"
          >
            <UploadIcon />
          </button>
          <button
            onClick={() => handleEditGroup(row)}
            className={styles.actionButton}
            title="Редактировать"
          >
            <EditPen />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className={classNames(styles.groups__container, "container")}>
        <div className={styles.groupsHeader}>
          <div className={styles.groupSwitch}>
            <Link
              href={"/profile/admin/courses-groups/courses-list"}
              className={classNames(styles.switchItem, {
                [styles.active]: pathname.endsWith("/courses-list"),
              })}
            >
              Курсы
            </Link>
            <Link
              href={"/profile/admin/courses-groups/groups-list"}
              className={classNames(styles.switchItem, {
                [styles.active]: pathname.endsWith("/groups-list"),
              })}
            >
              Группы
            </Link>
          </div>
          <button className={styles.addGroup} onClick={handleCreateGroup}>
            Добавить
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.contentHeader}>
            <h3 className={styles.title}>Группы</h3>

            <div className={styles.searchField}>
              <InputField
                leftIcon={<SearchIcon />}
                isShadow
                placeholder="Поиск групп..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className={styles.selectField}>
              <SelectField
                options={statusOptions}
                isShadow
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                placeholder="Выберите статус"
              />
            </div>
          </div>

          {errorMessage && (
            <div className={styles.errorNotification}>
              <span>{errorMessage}</span>
              <button
                onClick={handleDismissError}
                className={styles.dismissButton}
              >
                ✕
              </button>
            </div>
          )}

          <div className={styles.tableContainer}>
            {loadingGroups ? (
              <TableSkeleton />
            ) : (
              <Table
                columns={groupsColumns}
                data={filteredGroups}
                emptyMessage="Группы не найдены"
              />
            )}
          </div>
        </div>
      </div>

      <ProfileModal
        isOpen={viewModal.isOpen}
        onClose={viewModal.closeModal}
        title="Информация о группе"
        size="lg"
      >
        {viewModal.data && (
          <div className={styles.groupDetails}>
            <div className={styles.detailRow}>
              <strong>Название группы:</strong>
              <span>{viewModal.data.name}</span>
            </div>
            <div className={styles.detailRow}>
              <strong>Преподаватель:</strong>
              <span>{`${viewModal.data.teacher.first_name} ${viewModal.data.teacher.last_name}`}</span>
            </div>
            <div className={styles.detailRow}>
              <strong>Email преподавателя:</strong>
              <span>{viewModal.data.teacher.email}</span>
            </div>
            <div className={styles.detailRow}>
              <strong>Телефон преподавателя:</strong>
              <span>{viewModal.data.teacher.phone_number}</span>
            </div>
            <div className={styles.detailRow}>
              <strong>Дата начала:</strong>
              <span>
                {new Date(viewModal.data.start_date).toLocaleDateString()}
              </span>
            </div>
            <div className={styles.detailRow}>
              <strong>Дата окончания:</strong>
              <span>
                {new Date(viewModal.data.end_date).toLocaleDateString()}
              </span>
            </div>
            <div className={styles.detailRow}>
              <strong>Время занятий:</strong>
              <span>{viewModal.data.approximate_lesson_start}</span>
            </div>
            <div className={styles.detailRow}>
              <strong>Статус:</strong>
              <span
                className={classNames(styles.status, {
                  [styles.active]: viewModal.data.is_active,
                  [styles.inactive]: !viewModal.data.is_active,
                })}
                style={{ color: "#ffff" }}
              >
                {getStatusText(viewModal.data)}
              </span>
            </div>
            <div className={styles.detailRow}>
              <strong>Дата создания:</strong>
              <span>
                {new Date(viewModal.data.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}
      </ProfileModal>

      <EditGroupModal
        data={editModal.data}
        isOpen={editModal.isOpen}
        onClose={editModal.closeModal}
        onSuccess={handleEditSuccess}
        teachers={teachers || []}
      />

      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
        teachers={teachers || []}
      />
    </div>
  );
}
