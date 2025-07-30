import ProfileModal from "@components/ProfileModal";
import TextArea from "@components/Fields/TextAreaField";
import InputField from "@components/Fields/InputField";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "src/store/store";
import {
  updateHomeworkAssignment,
  deleteHomeworkAssignment,
} from "src/store/lesson/lesson.action";
import { clearSubmissionError } from "src/store/lesson/lesson.slice";
import DragAndDrop from "@components/DragAndDrop";
import styles from "./styles.module.scss";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
};

interface EditHomeworkForm {
  description: string;
  deadline: string;
  file: FileList | undefined;
}

const TeacherHomeworkEditModal: React.FC<Props> = ({
  isOpen,
  onClose,
  data,
}) => {
  const dispatch = useAppDispatch();
  const { submissionLoading, submissionError } = useAppSelector(
    (state) => state.lesson
  );

  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [removeFile, setRemoveFile] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteHomeworkConfirm, setShowDeleteHomeworkConfirm] =
    useState(false);
  const [showFileWarning, setShowFileWarning] = useState(false);
  const [dragKey, setDragKey] = useState(0);
  const [pendingFile, setPendingFile] = useState<FileList | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
    watch,
  } = useForm<EditHomeworkForm>({
    defaultValues: {
      description: "",
      deadline: "",
      file: undefined,
    },
  });

  const fileInput = watch("file");

  useEffect(() => {
    if (isOpen && data) {
      const deadlineDate = data.homeworkData?.deadline
        ? new Date(data.homeworkData.deadline).toISOString().slice(0, 16)
        : "";

      reset({
        description: data.homeworkData?.description || data.assignment || "",
        deadline: deadlineDate,
        file: undefined,
      });

      const filePath = data.homeworkData?.file_path;
      const shouldShowFile = filePath && !filePath.includes("blob");
      setCurrentFile(shouldShowFile ? filePath : null);
      setRemoveFile(false);
      setShowDeleteConfirm(false);
      setShowFileWarning(false);
      setShowDeleteHomeworkConfirm(false);
      dispatch(clearSubmissionError());
      setDragKey((k) => k + 1);
    }
  }, [isOpen, data, reset, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearSubmissionError());
      setShowDeleteConfirm(false);
      setShowFileWarning(false);
      setShowDeleteHomeworkConfirm(false);
    };
  }, [dispatch]);

  const handleClose = () => {
    dispatch(clearSubmissionError());
    onClose();
  };

  const handleRemoveCurrentFile = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setRemoveFile(true);
    setCurrentFile(null);
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleDeleteHomework = () => {
    setShowDeleteHomeworkConfirm(true);
  };

  const confirmDeleteHomework = async () => {
    if (data?.homeworkId) {
      try {
        await dispatch(deleteHomeworkAssignment(data.homeworkId)).unwrap();
        setShowDeleteHomeworkConfirm(false);
        onClose();
      } catch {
        setShowDeleteHomeworkConfirm(false);
      }
    }
  };

  const cancelDeleteHomework = () => {
    setShowDeleteHomeworkConfirm(false);
  };

  const confirmFileReplace = () => {
    if (pendingFile) {
      setValue("file", pendingFile);
      setPendingFile(null);
    }
    setShowFileWarning(false);
  };

  const cancelFileReplace = () => {
    setPendingFile(null);
    setShowFileWarning(false);
    setDragKey((k) => k + 1);
  };

  // const handleFileSelect = (files: FileList | null) => {
  //   if (files && files.length > 0 && (currentFile || fileInput)) {
  //     setPendingFile(files);
  //     setShowFileWarning(true);
  //   } else if (files) {
  //     setValue("file", files);
  //   }
  // };

  const onSubmit = async (formData: EditHomeworkForm) => {
    try {
      const fileToUpload =
        formData.file && formData.file[0] ? formData.file[0] : undefined;

      await dispatch(
        updateHomeworkAssignment({
          id: data.homeworkId,
          description: formData.description,
          deadline: formData.deadline,
          file: fileToUpload,
          removeFile: removeFile,
        })
      ).unwrap();

      reset();
      setDragKey((k) => k + 1);
      onClose();
    } catch {}
  };

  const isLoading = submissionLoading || isSubmitting;
  const today = new Date().toISOString().split("T")[0];

  return (
    <ProfileModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Редактировать домашнее задание"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className={styles.modal__form}>
        {submissionError && (
          <div
            style={{
              color: "red",
              backgroundColor: "#ffebee",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ffcdd2",
            }}
          >
            {submissionError}
          </div>
        )}

        <div>
          <h4>Описание задания</h4>
          <TextArea
            {...register("description", { required: "Описание обязательно" })}
            placeholder="Введите описание задания..."
            fullWidth
            isShadow
          />
        </div>

        <div>
          <h4>Файл (необязательно)</h4>

          {showDeleteConfirm && (
            <div
              style={{
                marginBottom: "10px",
                padding: "10px",
                backgroundColor: "#ffebee",
                borderRadius: "4px",
                border: "1px solid #ffcdd2",
              }}
            >
              <p style={{ margin: "0 0 10px 0" }}>
                Вы точно хотите удалить файл?
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className={styles.delete__button}
                >
                  Да, удалить
                </button>
                <button
                  type="button"
                  onClick={cancelDelete}
                  className={styles.cancel__button}
                >
                  Отмена
                </button>
              </div>
            </div>
          )}

          {showFileWarning && (
            <div
              style={{
                marginBottom: "10px",
                padding: "10px",
                backgroundColor: "#fff3cd",
                borderRadius: "4px",
                border: "1px solid #ffeaa7",
              }}
            >
              <p style={{ margin: "0 0 10px 0" }}>
                У вас уже есть прикрепленный файл. Хотите заменить его новым?
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={confirmFileReplace}
                  className={styles.save__button}
                >
                  Заменить
                </button>
                <button
                  type="button"
                  onClick={cancelFileReplace}
                  className={styles.cancel__button}
                >
                  Отмена
                </button>
              </div>
            </div>
          )}

          {currentFile && !removeFile && (
            <div
              style={{
                marginBottom: "10px",
                padding: "10px",
                backgroundColor: "#e8f5e8",
                borderRadius: "4px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>Текущий файл: {currentFile.split("/").pop()}</span>
              <button
                type="button"
                onClick={handleRemoveCurrentFile}
                className={styles.remove__file__button}
              >
                Удалить файл
              </button>
            </div>
          )}

          {removeFile && (
            <div
              style={{
                marginBottom: "10px",
                padding: "10px",
                backgroundColor: "#ffebee",
                borderRadius: "4px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>Файл будет удален при сохранении</span>
            </div>
          )}

          <DragAndDrop
            key={dragKey}
            selectedFiles={fileInput}
            onFileSelect={(files) => {
              if (files && files[0]) {
                if (currentFile && !removeFile) {
                  setShowFileWarning(true);
                  setPendingFile(files);
                  setValue("file", undefined);
                } else {
                  setCurrentFile(null);
                  setValue("file", files);
                  setPendingFile(null);
                  setRemoveFile(false);
                }
              } else {
                setValue("file", undefined);
                setPendingFile(null);
                setCurrentFile(null);
                setRemoveFile(false);
              }
            }}
            accept={".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"}
            multiple={false}
            disabled={isLoading || showDeleteConfirm || showFileWarning}
            isLoading={isLoading}
            buttonText="Выберите файл"
          />
        </div>

        <div>
          <h4>Дедлайн</h4>
          <InputField
            {...register("deadline", { required: "Дедлайн обязателен" })}
            type="datetime-local"
            min={today}
            fullWidth
            isShadow
          />
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "space-between",
            marginTop: "20px",
          }}
        >
          <button
            type="button"
            onClick={handleDeleteHomework}
            className={styles.delete__homework__button}
            disabled={isLoading}
          >
            Удалить задание
          </button>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="submit"
              className={styles.save__button}
              disabled={isLoading}
            >
              {isLoading ? "Сохранение..." : "Сохранить изменения"}
            </button>
          </div>
        </div>
      </form>

      {showDeleteHomeworkConfirm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              maxWidth: "400px",
              width: "90%",
            }}
          >
            <h4>Подтвердите удаление</h4>
            <p>
              Вы уверены, что хотите удалить это домашнее задание? Это действие
              нельзя отменить.
            </p>
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={cancelDeleteHomework}
                className={styles.cancel__button}
              >
                Отмена
              </button>
              <button
                onClick={confirmDeleteHomework}
                className={styles.delete__button}
                disabled={isLoading}
              >
                {isLoading ? "Удаление..." : "Удалить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ProfileModal>
  );
};

export default TeacherHomeworkEditModal;
