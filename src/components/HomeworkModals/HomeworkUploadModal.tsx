import ProfileModal from "@components/ProfileModal";
import TextArea from "@components/Fields/TextAreaField";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "src/store/store";
import {
  submitHomeworkSubmission,
  updateHomeworkSubmission,
  getHomeworkSubmissions,
} from "src/store/lesson/lesson.action";
import { clearSubmissionError } from "src/store/lesson/lesson.slice";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any; // { homework: HomeWorkTableItem; submission?: HomeworkSubmission; isEdit?: boolean }
  cancelClass?: string;
  saveClass?: string;
};

const HomeworkUploadModal: React.FC<Props> = ({
  isOpen,
  onClose,
  data,
  saveClass,
}) => {
  const dispatch = useAppDispatch();
  const { submissionLoading, submissionError, homework } = useAppSelector(
    (state) => state.lesson
  );
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [removeFile, setRemoveFile] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showFileWarning, setShowFileWarning] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
    watch,
  } = useForm({
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
      dispatch(clearSubmissionError());
    }
  }, [isOpen, data, reset, dispatch, homework]);

  useEffect(() => {
    return () => {
      dispatch(clearSubmissionError());
      setShowDeleteConfirm(false);
      setShowFileWarning(false);
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

  const handleFileSelect = (files: FileList | null) => {
    if (files && files[0]) {
      if (currentFile && !removeFile) {
        setShowFileWarning(true);
      } else {
        setCurrentFile(null);
      }
    }
  };
  const confirmFileReplace = () => {
    setShowFileWarning(false);
    setRemoveFile(false);
    setCurrentFile(null);
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
      const fileToUpload = formData.file?.[0] || null;

      if (data?.isEdit && data?.submission?.id) {
        if (removeFile && !fileToUpload) {
          const emptyBlob = new Blob();
          const result = await dispatch(
            updateHomeworkSubmission({
              submission_id: data.submission.id,
              content: formData.content || "",
              file: emptyBlob,
            })
          ).unwrap();

          setRemoveFile(false);
          setCurrentFile(null);
          reset({
            content: result.content,
            file: undefined,
          });
        } else {
          const result = await dispatch(
            updateHomeworkSubmission({
              submission_id: data.submission.id,
              content: formData.content || "",
              file: fileToUpload,
            })
          ).unwrap();

          if (result && result.file_path) {
            setCurrentFile(result.file_path);
            reset({
              content: result.content,
              file: undefined,
            });
          }
        }
      } else {
        await dispatch(
          submitHomeworkSubmission({
            homework_id: data.homework.homeworkId,
            content: formData.content || "",
            file: fileToUpload,
          })
        ).unwrap();
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
                  style={{
                    background: "none",
                    border: "none",
                    color: "red",
                    cursor: "pointer",
                    textDecoration: "underline",
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

            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              {...register("file")}
              onChange={(e) => handleFileSelect(e.target.files)}
              style={{ width: "100%" }}
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
              justifyContent: "flex-end",
              marginTop: "20px",
            }}
          >
            <button
              type="submit"
              className={saveClass}
              disabled={isLoading || showDeleteConfirm || showFileWarning}
            >
              {isLoading
                ? "Загрузка..."
                : data.isEdit
                ? "Сохранить изменения"
                : "Отправить"}
            </button>
          </div>
        </form>
      )}
    </ProfileModal>
  );
};

export default HomeworkUploadModal;
