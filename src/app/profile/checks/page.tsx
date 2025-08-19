"use client";
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "src/store/store";
import { getMyChecks } from "src/store/finance/finance.action";
import styles from "./styles.module.scss";
import CheckModal from "./ChekModal";
import Table from "@components/Table";
import DragAndDrop from "@components/DragAndDrop";
import classNames from "classnames";
import SelectField from "@components/Fields/SelectField";
import EditPen from "../../../../public/assets/icons/edit-pen.svg";
import { Check } from "src/consts/types";

const ChecksTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { myChecks, myChecksLoading, myChecksError } = useAppSelector(
    (state) => state.finance
  );

  const [selectedCheck, setSelectedCheck] = useState<Check | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    dispatch(getMyChecks(selectedGroupId));
  }, [dispatch, selectedGroupId]);

  const groupOptions = React.useMemo(() => {
    if (!myChecks) return [{ label: "Все группы", value: "all" }];

    const uniqueGroups = Array.from(
      new Map(myChecks.map((check) => [check.group.id, check.group])).values()
    );

    return [
      { label: "Все группы", value: "all" },
      ...uniqueGroups.map((group) => ({
        label: group.name,
        value: group.id.toString(),
      })),
    ];
  }, [myChecks]);

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

      dispatch(getMyChecks(selectedGroupId));
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const groupId = value === "all" ? undefined : parseInt(value);
    setSelectedGroupId(groupId);
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
            options={groupOptions}
            label="Группы"
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

      <CheckModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        check={selectedCheck}
        onUpdate={(updatedCheck: Check) => {
          console.log("Updated check:", updatedCheck);
          handleCloseModal();

          dispatch(getMyChecks(selectedGroupId));
        }}
        onDelete={(checkId: number) => {
          console.log("Deleted check ID:", checkId);
          handleCloseModal();

          dispatch(getMyChecks(selectedGroupId));
        }}
      />
    </div>
  );
};

export default ChecksTable;
