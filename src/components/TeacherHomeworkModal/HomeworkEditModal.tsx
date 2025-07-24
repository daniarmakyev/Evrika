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

const HomeworkEditModal: React.FC<Props> = ({ isOpen, onClose, data }) => {
  const dispatch = useAppDispatch();
  const { submissionLoading, submissionError } = useAppSelector(
    (state) => state.lesson
  );

  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [removeFile, setRemoveFile] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteHomeworkConfirm, setShowDeleteHomeworkConfirm] = useState(false);
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

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0 && (currentFile || fileInput)) {
      setPendingFile(files);
      setShowFileWarning(true);
    } else if (files) {
      setValue("file", files);
    }
  };

  const onSubmit = async (formData: EditHomeworkForm) => {
    try {
      const fileToUpload = formData.file && formData.file[0] ? formData.file[0] : undefined;

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
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
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
          {currentFile && !removeFile && (
            <div className={styles.current__file}>
              <div className={styles.file__info}>
                <span className={styles.file__name}>
                  Текущий файл: {currentFile.split("/").pop()}
                </span>
                <button
                  type="button"
                  onClick={handleRemoveCurrentFile}
                  className={styles.remove__file__button}
                >
                  Удалить файл
                </button>
              </div>
            </div>
          )}

          <DragAndDrop
            key={dragKey}
            selectedFiles={fileInput}
            onFileSelect={handleFileSelect}
            accept={".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"}
            multiple={false}
            disabled={isLoading}
            isLoading={isLoading}
            buttonText="Выберите новый файл"
          />

          {fileInput && fileInput[0] && (
            <div
              style={{
                marginTop: "5px",
                fontSize: "14px",
                color: "#666",
              }}
            >
              Выбран новый файл: {(fileInput[0] as File)?.name}
            </div>
          )}
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
              type="button"
              onClick={handleClose}
              className={styles.cancel__button}
              disabled={isLoading}
            >
              Отмена
            </button>
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

      {showDeleteConfirm && (
        <div className={styles.confirm__overlay}>
          <div className={styles.confirm__modal}>
            <h4>Подтвердите удаление</h4>
            <p>Вы уверены, что хотите удалить текущий файл?</p>
            <div className={styles.confirm__actions}>
              <button onClick={cancelDelete} className={styles.cancel__button}>
                Отмена
              </button>
              <button onClick={confirmDelete} className={styles.delete__button}>
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteHomeworkConfirm && (
        <div className={styles.confirm__overlay}>
          <div className={styles.confirm__modal}>
            <h4>Подтвердите удаление</h4>
            <p>
              Вы уверены, что хотите удалить это домашнее задание? Это действие нельзя отменить.
            </p>
            <div className={styles.confirm__actions}>
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

      {showFileWarning && (
        <div className={styles.confirm__overlay}>
          <div className={styles.confirm__modal}>
            <h4>Заменить файл?</h4>
            <p>У вас уже есть прикрепленный файл. Хотите заменить его новым?</p>
            <div className={styles.confirm__actions}>
              <button
                onClick={cancelFileReplace}
                className={styles.cancel__button}
              >
                Отмена
              </button>
              <button
                onClick={confirmFileReplace}
                className={styles.save__button}
              >
                Заменить
              </button>
            </div>
          </div>
        </div>
      )}
    </ProfileModal>
  );
};

export default HomeworkEditModal;