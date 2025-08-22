"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "src/store/store";
import {
  getMyChecks,
  createCheck,
  deleteCheck,
  downloadCheck,
} from "src/store/finance/finance.action";
import styles from "./styles.module.scss";
import CheckModal from "./ChekModal";
import Table from "@components/Table";
import DragAndDrop from "@components/DragAndDrop";
import classNames from "classnames";
import SelectField from "@components/Fields/SelectField";
import EditPen from "../../../../public/assets/icons/edit-pen.svg";
import FileIcon from "../../../../public/assets/icons/upload-file.svg";
import { Check } from "src/consts/types";
import { getGroup } from "src/store/user/user.action";

const ChecksTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    myChecks,
    myChecksLoading,
    myChecksError,
    createCheckLoading,
    createCheckError,
    downloadCheckLoading,
    downloadCheckError,
  } = useAppSelector((state) => state.finance);

  const { groups } = useAppSelector((state) => state.user);

  const [selectedCheck, setSelectedCheck] = useState<Check | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<number | undefined>();

  useEffect(() => {
    dispatch(getMyChecks(selectedGroupId));
    dispatch(getGroup());
  }, [dispatch, selectedGroupId]);

  const groupOptions = useMemo(() => {
    if (!groups || groups.groups.length === 0) {
      return [{ label: "Все группы", value: "all" }];
    }

    return [
      { label: "Все группы", value: "all" },
      ...groups.groups.map((group) => ({
        label: group.name,
        value: group.id.toString(),
      })),
    ];
  }, [groups]);

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

  const handleDownloadCheck = async (check: Check) => {
    try {
      await dispatch(
        downloadCheck({
          check_id: check.id,
          filename: check.check.split("/").pop() || `check_${check.id}`,
        })
      ).unwrap();
    } catch (error: unknown) {
      console.error("Error downloading check:", error);

      if (error instanceof Error) {
        console.error("Error message:", error.message);
      } else if (typeof error === "string") {
        console.error("Error string:", error);
      } else {
        console.error("Unknown error occurred");
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCheck(null);
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
  };

  const handleUpload = async () => {
    if (!uploadedFile || !selectedGroupId) {
      alert("Выберите файл и группу");
      return;
    }

    try {
      await dispatch(
        createCheck({
          file: uploadedFile,
          group_id: selectedGroupId,
        })
      ).unwrap();

      dispatch(getMyChecks(selectedGroupId));
      setUploadedFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Ошибка при загрузке чека");
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const groupId = value === "all" ? undefined : Number(value);
    setSelectedGroupId(groupId);
  };

  const columns: {
    key: string;
    title: string;
    width?: string;
    isButton?: boolean;
    render: (value: string, row: Check) => React.ReactNode;
  }[] = [
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
      title: "Действия",
      width: "25%",
      isButton: true,
      render: (_: string, row: Check) => (
        <div className={styles.table__actions}>
          <button
            className={styles.download__button}
            onClick={() => handleDownloadCheck(row)}
            title="Скачать чек"
            disabled={downloadCheckLoading}
          >
            <FileIcon />
            {downloadCheckLoading ? "Скачивание..." : "Скачать"}
          </button>
          <button
            className={styles.edit__table__button}
            onClick={() => handleViewCheck(row)}
            title="Редактировать чек"
          >
            <EditPen />
            Изменить
          </button>
        </div>
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
            options={groupOptions}
            label="Группы"
            value={selectedGroupId?.toString() || "all"}
            onChange={handleGroupChange}
          />
          <DragAndDrop
            onFileSelect={(files) => {
              if (files && files.length > 0) {
                handleFileUpload(files[0]);
              }
            }}
            accept="image/*,.pdf"
            maxSize={10 * 1024 * 1024}
          />

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
                  disabled={!selectedGroupId || createCheckLoading}
                  className={styles.send__button}
                >
                  {createCheckLoading ? "Отправка..." : "Отправить чек"}
                </button>
                <button
                  onClick={removeFile}
                  disabled={createCheckLoading}
                  className={styles.remove__button}
                >
                  Удалить
                </button>
              </div>
            </div>
          )}

          {!selectedGroupId && uploadedFile && (
            <p className={styles.error__message}>
              Выберите группу для загрузки чека
            </p>
          )}

          {(createCheckError || downloadCheckError) && (
            <p className={styles.error__message}>
              {createCheckError || downloadCheckError}
            </p>
          )}
        </div>
      </div>

      <div className={styles.checks__content}>
        <h2 className={styles.checks__title}>Чеки</h2>
        <div className={styles.table__container}>
          <div className={styles.table__container__checks}>
            {myChecksLoading ? (
              <div className={styles.loading}>Загрузка чеков...</div>
            ) : myChecksError ? (
              <div className={styles.error}>Ошибка загрузки чеков</div>
            ) : (
              <Table
                columns={columns}
                data={myChecks || []}
                emptyMessage="Чеки не найдены"
              />
            )}
          </div>
        </div>
      </div>

      <CheckModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        check={selectedCheck}
        onUpdate={() => {
          handleCloseModal();
          dispatch(getMyChecks(selectedGroupId));
        }}
        onDelete={async () => {
          if (!selectedCheck) return;
          try {
            await dispatch(deleteCheck(selectedCheck.id)).unwrap();
            handleCloseModal();
            dispatch(getMyChecks(selectedGroupId));
          } catch (error) {
            console.error("Ошибка при удалении:", error);
          }
        }}
      />
    </div>
  );
};

export default ChecksTable;
