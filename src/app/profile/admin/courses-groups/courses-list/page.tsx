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
import TextArea from "@components/Fields/TextAreaField";
import InputField from "@components/Fields/InputField";
import UploadIcon from "@icons/upload-file.svg";
import SearchIcon from "@icons/searchIcon.svg";
import EditModal from "./EditModal";
import CreateCourseModal from "./CreateModal";
import { Course, CourseTableItem } from "src/consts/types";
import { useAppDispatch, useAppSelector } from "src/store/store";
import {
  getCourses,
  getLanguages,
  getLevels,
} from "src/store/courseGroup/courseGroup.action";

const TableSkeleton = () => (
  <div className={styles.tableSkeleton}>
    <div className={styles.tableHeaderSkeleton}>
      <div className={styles.skeletonHeaderCell}></div>
      <div className={styles.skeletonHeaderCell}></div>
      <div className={styles.skeletonHeaderCell}></div>
    </div>
    <div className={styles.tableBodySkeleton}>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className={styles.tableRowSkeletonDiv}>
          <div className={styles.skeletonCell}></div>
          <div className={styles.skeletonCell}></div>
          <div className={styles.skeletonButtonCell}></div>
        </div>
      ))}
    </div>
  </div>
);

export default function CoursesList() {
  const pathname = usePathname();

  const [filteredCourses, setFilteredCourses] = useState<CourseTableItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguageId, setSelectedLanguageId] = useState("");
  const { courses, loadingCourses, languages, levels } = useAppSelector(
    (state) => state.groupsCourses
  );
  const viewModal = useModal<Course>("view");
  const editModal = useModal<Course>("edit");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCourses());
    dispatch(getLanguages());
    dispatch(getLevels());
  }, [dispatch]);

  useEffect(() => {
    if (courses) {
      let filtered = courses;

      if (searchTerm) {
        filtered = filtered.filter((course) =>
          course.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (selectedLanguageId) {
        filtered = filtered.filter(
          (course) => course.language_id === parseInt(selectedLanguageId)
        );
      }

      const tableData = filtered.map((course) => ({
        id: course.id,
        name: course.name,
        price: course.price,
        language_name: course.language_name,
        level_code: course.level_code,
        description: course.description,
      }));

      setFilteredCourses(tableData);
    }
  }, [courses, searchTerm, selectedLanguageId]);

  const handleViewCourse = (course: CourseTableItem) => {
    if (courses) {
      const fullCourse = courses.find((c) => c.id === course.id);
      if (fullCourse) {
        viewModal.openModal(fullCourse);
      }
    }
  };

  const handleEditCourse = (course: CourseTableItem) => {
    if (courses) {
      const fullCourse = courses.find((c) => c.id === course.id);
      if (fullCourse) {
        editModal.openModal(fullCourse);
      }
    }
  };

  const handleCreateCourse = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    dispatch(getCourses());
  };

  const handleEditSuccess = () => {
    editModal.closeModal();
    dispatch(getCourses());
  };

  const coursesColumns = [
    {
      key: "name",
      title: "Название курса",
      width: "150px",
    },
    {
      key: "price",
      title: "Цена за месяц",
      width: "150px",
      render: (value: number) => <span>{value.toLocaleString()} сом</span>,
    },
    {
      key: "actions",
      title: "Действия",
      width: "150px",
      isButton: true,
      render: (_: string, row: CourseTableItem) => (
        <div className={styles.actionButtons}>
          <button
            onClick={() => handleViewCourse(row)}
            className={styles.actionButton}
            title="Просмотр"
          >
            <UploadIcon />
          </button>
          <button
            onClick={() => handleEditCourse(row)}
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
      <div className={classNames(styles.courses__container, "container")}>
        <div className={styles.coursesHeader}>
          <div className={styles.courseGroupSwitch}>
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
          <button className={styles.addCourse} onClick={handleCreateCourse}>
            Добавить
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.contentHeader}>
            <h3 className={styles.title}>Курсы</h3>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <div className={styles.searchField}>
                <InputField
                  leftIcon={<SearchIcon />}
                  isShadow
                  placeholder="Поиск курсов..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {languages && (
                <div className={styles.selectField}>
                  <SelectField
                    options={[
                      { label: "Все языки", value: "" },
                      ...languages.map((lang) => ({
                        label: lang.name,
                        value: lang.id.toString(),
                      })),
                    ]}
                    isShadow
                    value={selectedLanguageId}
                    onChange={(e) => {
                      setSelectedLanguageId(e.target.value);
                    }}
                    placeholder="Выберите язык"
                  />
                </div>
              )}
            </div>
          </div>

          <div className={styles.tableContainer}>
            {loadingCourses ? (
              <TableSkeleton />
            ) : (
              <Table
                columns={coursesColumns}
                data={filteredCourses}
                emptyMessage="Курсы не найдены"
              />
            )}
          </div>
        </div>
      </div>

      <ProfileModal
        isOpen={viewModal.isOpen}
        onClose={viewModal.closeModal}
        title="Информация о курсе"
        size="lg"
      >
        {viewModal.data && (
          <div className={styles.courseDetails}>
            <div className={styles.detailRow}>
              <strong>Название:</strong>
              <span>{viewModal.data.name}</span>
            </div>
            <div className={styles.detailRow}>
              <strong>Язык:</strong>
              <span>{viewModal.data.language_name}</span>
            </div>
            <div className={styles.detailRow}>
              <strong>Уровень:</strong>
              <span>{viewModal.data.level_code}</span>
            </div>
            <div className={styles.detailRow}>
              <strong>Цена за месяц:</strong>
              <span>{viewModal.data.price.toLocaleString()} сом</span>
            </div>
            <div className={styles.detailRow}>
              <strong>Дата создания:</strong>
              <span>
                {new Date(viewModal.data.created_at).toLocaleDateString()}
              </span>
            </div>
            {viewModal.data.description && (
              <div className={styles.detailColumn}>
                <strong>Описание:</strong>
                <TextArea
                  value={viewModal.data.description}
                  readOnly
                  fullWidth
                  rows={4}
                />
              </div>
            )}
          </div>
        )}
      </ProfileModal>

      {languages && levels && (
        <>
          <EditModal
            data={editModal.data}
            isOpen={editModal.isOpen}
            onClose={editModal.closeModal}
            languageOptions={languages}
            levelOptions={levels}
            onSuccess={handleEditSuccess}
          />

          <CreateCourseModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            languageOptions={languages}
            levelOptions={levels}
            onSuccess={handleCreateSuccess}
          />
        </>
      )}
    </div>
  );
}
