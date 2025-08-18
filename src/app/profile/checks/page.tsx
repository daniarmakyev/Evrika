"use client";
import React, { useState } from "react";
import styles from "./styles.module.scss";
import CheckModal from "./ChekModal";
import Table from "@components/Table";
import DragAndDrop from "@components/DragAndDrop";
import classNames from "classnames";
import SelectField from "@components/Fields/SelectField";
import EditPen from "../../../../public/assets/icons/edit-pen.svg";
interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: string;
}

interface Group {
  id: number;
  name: string;
  created_at: string;
  start_date: string;
  end_date: string;
  approximate_lesson_start: string;
  is_active: boolean;
  is_archived: boolean;
  course_id: number;
  teacher_id: number;
}

interface Check {
  id: number;
  check: string;
  student_id: number;
  group_id: number;
  uploaded_at: string;
  group: Group;
  student: Student;
}

const mockChecks: Check[] = [
  {
    id: 1,
    check: "f97d735028764b528794bf712653efd8.jpg",
    student_id: 3,
    group_id: 1,
    uploaded_at: "2025-08-18T21:26:53.166716",
    group: {
      id: 1,
      name: "Английский-B1-0825-1",
      created_at: "2025-08-14T09:13:06.586770Z",
      start_date: "2025-08-14",
      end_date: "2025-08-14",
      approximate_lesson_start: "09:11:00",
      is_active: true,
      is_archived: false,
      course_id: 1,
      teacher_id: 2,
    },
    student: {
      id: 3,
      first_name: "Бегимай",
      last_name: "Абдылдаева",
      email: "begish@begish.com",
      phone_number: "+9965111222333",
      role: "student",
    },
  },
  {
    id: 2,
    check: "another_check_example.jpg",
    student_id: 4,
    group_id: 1,
    uploaded_at: "2025-08-19T14:15:30.123456",
    group: {
      id: 1,
      name: "Английский-B1-0825-1",
      created_at: "2025-08-14T09:13:06.586770Z",
      start_date: "2025-08-14",
      end_date: "2025-08-14",
      approximate_lesson_start: "09:11:00",
      is_active: true,
      is_archived: false,
      course_id: 1,
      teacher_id: 2,
    },
    student: {
      id: 4,
      first_name: "Айжан",
      last_name: "Кочкорова",
      email: "aizhan@example.com",
      phone_number: "+9965444555666",
      role: "student",
    },
  },
];

const ChecksTable: React.FC = () => {
  const [selectedCheck, setSelectedCheck] = useState<Check | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewCheck = (check: Check) => {
    setSelectedCheck(check);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCheck(null);
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
  };

  const handleUpload = async () => {
    if (!uploadedFile) return;

    setUploading(true);
    try {
      console.log("Uploading file:", uploadedFile.name);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      setUploadedFile(null);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  const columns = [
    {
      key: "group",
      title: "Группа",
      width: "25%",
      render: (_: string, row: Check) => row.group.name,
    },
    {
      key: "uploaded_at",
      title: "Дата отправки",
      width: "30%",
      render: (value: string) => formatDate(value),
    },
    {
      key: "actions",
      title: "Просмотр",
      width: "20%",
      isButton: true,
      render: (_: string, row: Check) => (
        <button
          className={styles.view__button}
          onClick={() => handleViewCheck(row)}
        >
          <EditPen />
        </button>
      ),
    },
  ];

  return (
    <div className={classNames("container", styles.checks__container)}>
      <div className={styles.checks__content}>
        <h3 className={styles.checks__title}>Загрузка чеков</h3>

        <div className={styles.checks__content__upload}>
          <SelectField
            isShadow
            options={[{ label: "Селект", value: "Селект" }]}
            label="Группы"
          />
          <DragAndDrop
            onFileSelect={(files) => {
              if (files && files.length > 0) {
                handleFileUpload(files[0]);
              }
            }}
            accept="image/*,.pdf"
            maxSize={10 * 1024 * 1024}
          ></DragAndDrop>

          {uploadedFile && (
            <div className={styles.file__preview}>
              <div className={styles.file__info}>
                <span className={styles.file__name}>{uploadedFile.name}</span>
                <span className={styles.file__size}>
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
              <div className={styles.file__actions}>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className={styles.send__button}
                >
                  {uploading ? "Отправка..." : "Отправить чек"}
                </button>
                <button
                  onClick={removeFile}
                  disabled={uploading}
                  className={styles.remove__button}
                >
                  Удалить
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.checks__content}>
        <h2 className={styles.checks__title}>Чеки</h2>
        <div className={styles.table__container}>
          <Table
            columns={columns}
            data={mockChecks}
            emptyMessage="Чеки не найдены"
          />
        </div>
      </div>

      <CheckModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        check={selectedCheck}
        onUpdate={(updatedCheck: Check) => {
          console.log("Updated check:", updatedCheck);
          handleCloseModal();
        }}
        onDelete={(checkId: number) => {
          console.log("Deleted check ID:", checkId);
          handleCloseModal();
        }}
      />
    </div>
  );
};

export default ChecksTable;
