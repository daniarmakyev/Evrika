import ProfileModal from "@components/ProfileModal";
import TextArea from "@components/Fields/TextAreaField";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "src/store/store";
import {
  submitHomeworkSubmission,
  updateHomeworkSubmission,
  deleteHomeworkSubmission,
} from "src/store/lesson/lesson.action";
import {
  clearSubmissionError,
  removeHomeworkSubmission,
} from "src/store/lesson/lesson.slice";
import DragAndDrop from "@components/DragAndDrop";
import styles from "./styles.module.scss";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any; // { homework: HomeWorkTableItem; submission?: HomeworkSubmission; isEdit?: boolean }
};

const HomeworkUploadModal: React.FC<Props> = ({ isOpen, onClose, data }) => {
  const dispatch = useAppDispatch();
  const { submissionLoading, submissionError, homework } = useAppSelector(
    (state) => state.lesson
  );
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [removeFile, setRemoveFile] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showFileWarning, setShowFileWarning] = useState(false);
  const [showDeleteSubmissionConfirm, setShowDeleteSubmissionConfirm] =
    useState(false);
  const [dragKey, setDragKey] = useState(0);
  const [pendingFile, setPendingFile] = useState<FileList | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
    watch,
  } = useForm<{
    content: string;
    file: FileList | undefined;
  }>({
    defaultValues: {
      content: data?.submission?.content || "",
      file: undefined,
    },
  });

  const fileInput = watch("file");

  useEffect(() => {
    if (isOpen) {
      reset({
        content: data?.submission?.content || "",
        file: undefined,
      });
      const filePath = data?.submission?.file_path;
      const shouldShowFile = filePath && !filePath.includes("blob");
      setCurrentFile(shouldShowFile ? filePath : null);
      setRemoveFile(false);
      setShowDeleteConfirm(false);
      setShowFileWarning(false);
      setShowDeleteSubmissionConfirm(false);
      dispatch(clearSubmissionError());
    }
  }, [isOpen, data, reset, dispatch, homework]);

  useEffect(() => {
    return () => {
      dispatch(clearSubmissionError());
      setShowDeleteConfirm(false);
      setShowFileWarning(false);
      setShowDeleteSubmissionConfirm(false);
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
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleDeleteSubmission = () => {
    setShowDeleteSubmissionConfirm(true);
  };

  const confirmDeleteSubmission = async () => {
    if (data?.submission?.id) {
      try {
        const submissionId = data.submission.id;
        await dispatch(deleteHomeworkSubmission(submissionId)).unwrap();

        // Если thunk не обновил состояние, делаем это вручную
        dispatch(removeHomeworkSubmission(submissionId));

        setShowDeleteSubmissionConfirm(false);
        onClose();
      } catch (error) {
        console.error("Error deleting homework submission:", error);
        setShowDeleteSubmissionConfirm(false);
      }
    }
  };

  const cancelDeleteSubmission = () => {
    setShowDeleteSubmissionConfirm(false);
  };

  const confirmFileReplace = () => {
    setShowFileWarning(false);
    setRemoveFile(false);
    setCurrentFile(null);
    if (pendingFile) {
      setValue("file", pendingFile);
      setPendingFile(null);
    }
  };

  const cancelFileReplace = () => {
    setShowFileWarning(false);
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (formData: any) => {
    if (!data?.homework?.homeworkId) return;

    try {
      const fileToUpload = formData.file && formData.file[0] ? formData.file[0] : undefined;

      if (data?.isEdit && data?.submission?.id) {
        const hasFileChanges = typeof fileToUpload !== "undefined" || removeFile;

        if (hasFileChanges) {
          const result = await dispatch(
            updateHomeworkSubmission({
              submission_id: data.submission.id,
              content: formData.content || "",
              file: removeFile ? null : fileToUpload,
              removeFile: removeFile,
            })
          ).unwrap();

          setRemoveFile(false);

          if (removeFile) {
            setCurrentFile(null);
          } else if (result && result.file_path) {
            setCurrentFile(result.file_path);
          }

          reset({
            content: result.content,
            file: undefined,
          });
          setDragKey((k) => k + 1);
        } else {
          const result = await dispatch(
            updateHomeworkSubmission({
              submission_id: data.submission.id,
              content: formData.content || "",
            })
          ).unwrap();

          reset({
            content: result.content,
            file: undefined,
          });
          setDragKey((k) => k + 1);
        }
      } else {
        await dispatch(
          submitHomeworkSubmission({
            homework_id: data.homework.homeworkId,
            content: formData.content || "",
            file: fileToUpload,
          })
        ).unwrap();

        reset({
          content: "",
          file: undefined,
        });
        setDragKey((k) => k + 1);
        onClose();
      }
    } catch (error) {
      console.error("Error submitting homework:", error);
    }
  };

  const isLoading = submissionLoading || isSubmitting;

  return (
    <ProfileModal
      isOpen={isOpen}
      onClose={handleClose}
      title={data?.isEdit ? "Редактировать задание" : "Загрузить задание"}
      size="lg"
    >
      {data && (
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
            <h4>Задание</h4>
            <TextArea
              value={data.homework?.homeworkData?.description || ""}
              readOnly
              isShadow
              fullWidth
            />
          </div>

          <div>
            <h4>Ваш ответ</h4>
            <TextArea
              {...register("content")}
              placeholder="Введите ваш ответ здесь..."
              fullWidth
              isShadow
            />
          </div>

          <div>
            <h4>Файл</h4>

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
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#f44336",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Да, удалить
                  </button>
                  <button
                    type="button"
                    onClick={cancelDelete}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#9e9e9e",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
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
                  Предыдущий файл будет заменен новым. Продолжить?
                </p>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={confirmFileReplace}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#ff9800",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Да, заменить
                  </button>
                  <button
                    type="button"
                    onClick={cancelFileReplace}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#9e9e9e",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Отмена
                  </button>
                </div>
              </div>
            )}

            {showDeleteSubmissionConfirm && (
              <div
                style={{
                  marginBottom: "10px",
                  padding: "15px",
                  backgroundColor: "#ffebee",
                  borderRadius: "4px",
                  border: "2px solid #f44336",
                }}
              >
                <p
                  style={{
                    margin: "0 0 15px 0",
                    fontWeight: "bold",
                    color: "#d32f2f",
                  }}
                >
                  Вы точно хотите удалить это домашнее задание?
                </p>
                <p
                  style={{
                    margin: "0 0 15px 0",
                    fontSize: "14px",
                    color: "#666",
                  }}
                >
                  Это действие нельзя будет отменить. Все данные будут потеряны.
                </p>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={confirmDeleteSubmission}
                    disabled={isLoading}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#f44336",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      opacity: isLoading ? 0.6 : 1,
                    }}
                  >
                    {isLoading ? "Удаление..." : "Да, удалить"}
                  </button>
                  <button
                    type="button"
                    onClick={cancelDeleteSubmission}
                    disabled={isLoading}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#9e9e9e",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      opacity: isLoading ? 0.6 : 1,
                    }}
                  >
                    Отмена
                  </button>
                </div>
              </div>
            )}

            {currentFile &&
              !removeFile &&
              !currentFile.split("/").pop()?.toLowerCase().includes("blob") && (
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
                    style={{
                      background: "none",
                      border: "none",
                      color: "red",
                      cursor: "pointer",
                      textDecoration: "underline",
                      borderRadius: "10px",
                    }}
                  >
                    Удалить
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
              disabled={
                isLoading ||
                showDeleteConfirm ||
                showFileWarning ||
                showDeleteSubmissionConfirm
              }
              isLoading={isLoading}
              buttonText="Выберите файл"
            />

            {fileInput && fileInput[0] && !showFileWarning && (
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

          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            {data?.isEdit && data?.submission?.id && (
              <button
                type="button"
                onClick={handleDeleteSubmission}
                disabled={isLoading || showDeleteSubmissionConfirm}
                className={styles.delete__button}
              >
                Удалить задание
              </button>
            )}

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="submit"
                className={styles.save__button}
                disabled={
                  isLoading ||
                  showDeleteConfirm ||
                  showFileWarning ||
                  showDeleteSubmissionConfirm
                }
              >
                {isLoading
                  ? "Загрузка..."
                  : data.isEdit
                  ? "Сохранить изменения"
                  : "Отправить"}
              </button>
            </div>
          </div>
        </form>
      )}
    </ProfileModal>
  );
};

export default HomeworkUploadModal;
