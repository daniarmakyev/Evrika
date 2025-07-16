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
  cancelClass,
  saveClass,
}) => {
  const dispatch = useAppDispatch();
  const { submissionLoading, submissionError } = useAppSelector(
    (state) => state.lesson
  );
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [removeFile, setRemoveFile] = useState(false);

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
      setCurrentFile(data?.submission?.file_path || null);
      setRemoveFile(false);
      dispatch(clearSubmissionError());
    }
  }, [isOpen, data, reset, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearSubmissionError());
    };
  }, [dispatch]);

  const handleClose = () => {
    dispatch(clearSubmissionError());
    onClose();
  };

  const handleRemoveCurrentFile = () => {
    setRemoveFile(true);
    setCurrentFile(null);
  };

  const handleRestoreCurrentFile = () => {
    setRemoveFile(false);
    setCurrentFile(data?.submission?.file_path || null);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (formData: any) => {
    if (!data?.homework?.homeworkId) return;

    try {
      const fileToUpload = formData.file?.[0] || null;

      if (data?.isEdit && data?.submission?.id) {
        await dispatch(
          updateHomeworkSubmission({
            submission_id: data.submission.id,
            content: formData.content || "",
            file: fileToUpload,
          })
        ).unwrap();
      } else {
        await dispatch(
          submitHomeworkSubmission({
            homework_id: data.homework.homeworkId,
            content: formData.content || "",
            file: fileToUpload,
          })
        ).unwrap();
      }

      await dispatch(getHomeworkSubmissions(data.homework.homeworkId));
      handleClose();
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

            {currentFile && !removeFile && (
              <div
                style={{
                  marginBottom: "10px",
                  padding: "10px",
                  backgroundColor: "#f5f5f5",
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
                  backgroundColor: "#fff3cd",
                  borderRadius: "4px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>Файл будет удален</span>
                <button
                  type="button"
                  onClick={handleRestoreCurrentFile}
                  style={{
                    background: "none",
                    border: "none",
                    color: "blue",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Восстановить
                </button>
              </div>
            )}

            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              {...register("file")}
              style={{ width: "100%" }}
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

          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "flex-end",
              marginTop: "20px",
            }}
          >
            <button
              type="button"
              onClick={handleClose}
              className={cancelClass}
              disabled={isLoading}
            >
              Отмена
            </button>
            <button type="submit" className={saveClass} disabled={isLoading}>
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
