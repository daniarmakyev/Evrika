import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "src/store/store";
import { updateCheck, downloadCheck } from "src/store/finance/finance.action";
import ProfileModal from "@components/ProfileModal";
import styles from "./styles.module.scss";

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

interface CheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  check: Check | null;
  onUpdate: (check: Check) => void;
  onDelete: (checkId: number) => void;
}

const CheckModal: React.FC<CheckModalProps> = ({
  isOpen,
  onClose,
  check,
  onUpdate,
  onDelete,
}) => {
  const dispatch = useAppDispatch();
  const { downloadCheckLoading, downloadCheckError } = useAppSelector(
    (state) => state.finance
  );
  const [newCheckFile, setNewCheckFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!check) return null;

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewCheckFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpdate = async () => {
    if (!newCheckFile) {
      setError("Пожалуйста, выберите файл для замены");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await dispatch(
        updateCheck({
          check_id: check.id,
          file: newCheckFile,
          group_id: check.group_id,
        })
      ).unwrap();

      onUpdate(result);

      setIsEditing(false);
      setNewCheckFile(null);
    } catch (error: any) {
      console.error("Error updating check:", error);
      setError(error || "Произошла ошибка при обновлении чека");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      onDelete(check.id);
    } catch (error) {
      console.error("Error deleting check:", error);
      setError("Произошла ошибка при удалении чека");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      await dispatch(
        downloadCheck({
          check_id: check.id,
          filename: check.check.split("/").pop() || `check_${check.id}`,
        })
      ).unwrap();
    } catch (error: any) {
      console.error("Error downloading check:", error);
      setError(error || "Произошла ошибка при скачивании файла");
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    setNewCheckFile(null);
    setShowDeleteConfirm(false);
    setError(null);
    onClose();
  };

  const getFileExtension = (filename: string) => {
    return filename.split(".").pop()?.toLowerCase() || "";
  };

  const getFileIcon = (filename: string) => {
    const extension = getFileExtension(filename);

    switch (extension) {
      case "pdf":
        return "📄";
      case "doc":
      case "docx":
        return "📝";
      case "xls":
      case "xlsx":
        return "📊";
      case "txt":
        return "📃";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "🖼️";
      case "zip":
      case "rar":
        return "🗜️";
      default:
        return "📁";
    }
  };

  const validateFile = (file: File) => {
    const maxSize = 10 * 1024 * 1024;
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (file.size > maxSize) {
      return "Размер файла не должен превышать 10MB";
    }

    if (!allowedTypes.includes(file.type)) {
      return "Неподдерживаемый тип файла";
    }

    return null;
  };

  const handleFileChangeWithValidation = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validationError = validateFile(file);

      if (validationError) {
        setError(validationError);
        setNewCheckFile(null);
        e.target.value = "";
        return;
      }

      setNewCheckFile(file);
      setError(null);
    }
  };

  return (
    <ProfileModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Просмотр чека"
      size="lg"
    >
      <div className={styles.modal__content}>
        {(error || downloadCheckError) && (
          <div className={styles.error__message}>
            <span className={styles.error__text}>
              {error || downloadCheckError}
            </span>
          </div>
        )}

        <div className={styles.check__info}>
          <div className={styles.info__row}>
            <span className={styles.info__label}>Группа:</span>
            <span className={styles.info__value}>{check.group.name}</span>
          </div>
          <div className={styles.info__row}>
            <span className={styles.info__label}>Студент:</span>
            <span className={styles.info__value}>
              {check.student.first_name} {check.student.last_name}
            </span>
          </div>
          <div className={styles.info__row}>
            <span className={styles.info__label}>Дата отправки:</span>
            <span className={styles.info__value}>
              {formatDate(check.uploaded_at)}
            </span>
          </div>
        </div>

        <div className={styles.check__file}>
          <h4>Текущий чек:</h4>
          <div className={styles.file__preview}>
            <div className={styles.file__icon}>{getFileIcon(check.check)}</div>
            <div className={styles.file__info}>
              <p className={styles.file__name}>{check.check}</p>
              <button
                onClick={handleDownload}
                className={styles.download__file__button}
                disabled={loading || downloadCheckLoading}
              >
                {downloadCheckLoading ? "Скачивание..." : "Скачать файл"}
              </button>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className={styles.edit__section}>
            <h4>Заменить чек:</h4>
            <div className={styles.file__input__container}>
              <input
                type="file"
                accept="image/*,.pdf,.doc,.docx,.txt"
                onChange={handleFileChangeWithValidation}
                className={styles.file__input}
                disabled={loading}
              />
              <small className={styles.file__hint}>
                Поддерживаемые форматы: изображения, PDF, DOC, DOCX, TXT.
                Максимальный размер: 10MB
              </small>
            </div>
            {newCheckFile && (
              <div className={styles.selected__file}>
                <span className={styles.file__icon}>
                  {getFileIcon(newCheckFile.name)}
                </span>
                <span className={styles.file__name}>
                  Выбран файл: {newCheckFile.name}
                </span>
                <span className={styles.file__size}>
                  ({(newCheckFile.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
            )}
          </div>
        )}

        {showDeleteConfirm && (
          <div className={styles.delete__confirm}>
            <p className={styles.confirm__text}>
              Вы уверены, что хотите удалить этот чек?
            </p>
            <p className={styles.confirm__subtext}>
              Это действие нельзя будет отменить.
            </p>
            <div className={styles.confirm__actions}>
              <button
                onClick={handleDelete}
                disabled={loading}
                className={styles.confirm__delete}
              >
                {loading ? "Удаление..." : "Да, удалить"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={loading}
                className={styles.confirm__cancel}
              >
                Отмена
              </button>
            </div>
          </div>
        )}

        <div className={styles.modal__actions}>
          {!isEditing && !showDeleteConfirm && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className={styles.edit__button}
                disabled={loading}
              >
                Изменить чек
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className={styles.delete__button}
                disabled={loading}
              >
                Удалить чек
              </button>
            </>
          )}

          {isEditing && (
            <>
              <button
                onClick={handleUpdate}
                disabled={!newCheckFile || loading}
                className={styles.save__button}
              >
                {loading ? "Сохранение..." : "Сохранить"}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setNewCheckFile(null);
                  setError(null);
                }}
                disabled={loading}
                className={styles.cancel__button}
              >
                Отмена
              </button>
            </>
          )}

          <button
            onClick={handleClose}
            disabled={loading}
            className={styles.close__button}
          >
            Закрыть
          </button>
        </div>
      </div>
    </ProfileModal>
  );
};

export default CheckModal;
