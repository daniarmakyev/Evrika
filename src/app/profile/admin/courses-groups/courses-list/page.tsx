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

interface Course {
  id: number;
  name: string;
  price: number;
  description: string;
  language_id: number;
  level_id: number;
  language_name: string;
  level_code: string;
  created_at: string;
}

interface CourseTableItem {
  id: number;
  name: string;
  price: number;
  language_name: string;
  level_code: string;
  description: string;
}

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

  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<CourseTableItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");

  const viewModal = useModal<Course>("view");
  const editModal = useModal<Course>("edit");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const languageOptions = [
    { value: "", label: "Все языки" },
    { value: "Английский", label: "Английский" },
    { value: "Испанский", label: "Испанский" },
    { value: "Французский", label: "Французский" },
  ];

  const loadCourses = () => {
    setLoading(true);
    setTimeout(() => {
      const mockData: Course[] = [
        {
          id: 1,
          name: "Английский",
          price: 15000,
          description: "Курс разговорного английского языка для начинающих",
          language_id: 1,
          level_id: 1,
          language_name: "Английский",
          level_code: "A1",
          created_at: "2025-01-01T10:00:00.000Z",
        },
        {
          id: 2,
          name: "Испанский",
          price: 20000,
          description: "Курс бизнес английского для профессионалов",
          language_id: 1,
          level_id: 2,
          language_name: "Испанский",
          level_code: "B2",
          created_at: "2025-01-02T10:00:00.000Z",
        },
      ];
      setCourses(mockData);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter((course) =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLanguage) {
      filtered = filtered.filter(
        (course) =>
          course.language_name.toLowerCase() === selectedLanguage.toLowerCase()
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
  }, [courses, searchTerm, selectedLanguage]);

  const handleViewCourse = (course: CourseTableItem) => {
    const fullCourse = courses.find((c) => c.id === course.id);
    if (fullCourse) {
      viewModal.openModal(fullCourse);
    }
  };

  const handleEditCourse = (course: CourseTableItem) => {
    const fullCourse = courses.find((c) => c.id === course.id);
    if (fullCourse) {
      editModal.openModal(fullCourse);
    }
  };

  const handleCreateCourse = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    // Здесь будет перезагрузка данных после создания
    loadCourses();
  };

  const handleEditSuccess = () => {
    editModal.closeModal();

    loadCourses();
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

            <div className={styles.searchField}>
              <InputField
                leftIcon={<SearchIcon />}
                isShadow
                placeholder="Поиск курсов..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className={styles.selectField}>
              <SelectField
                options={languageOptions}
                isShadow
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                placeholder="Выберите язык"
              />
            </div>
          </div>

          <div className={styles.tableContainer}>
            {loading ? (
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
            <div className={styles.detailColumn}>
              <strong>Описание:</strong>
              <TextArea
                value={viewModal.data.description}
                readOnly
                fullWidth
                rows={4}
              />
            </div>
          </div>
        )}
      </ProfileModal>

      <EditModal
        data={editModal.data}
        isOpen={editModal.isOpen}
        onClose={editModal.closeModal}
        languageOptions={languageOptions}
        onSuccess={handleEditSuccess}
      />

      <CreateCourseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        languageOptions={languageOptions}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
