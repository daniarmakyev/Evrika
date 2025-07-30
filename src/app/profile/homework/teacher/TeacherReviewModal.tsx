import ProfileModal from "@components/ProfileModal";
import TextArea from "@components/Fields/TextAreaField";
import React, { useState, useEffect } from "react";
import { HomeworkSubmission } from "src/consts/types";
import styles from "./styles.module.scss";
import { useAppDispatch } from "src/store/store";
import {
  createHomeworkReview,
  updateHomeworkReview,
} from "src/store/lesson/lesson.action";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  submission?: HomeworkSubmission | null;
  loading?: boolean;
  onSuccess?: () => void;
};

const TeacherReviewModal: React.FC<Props> = ({
  isOpen,
  onClose,
  submission,

  onSuccess,
}) => {
  const dispatch = useAppDispatch();
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && submission) {
      setReviewComment(submission.review?.comment || "");
    }
  }, [isOpen, submission]);

  const handleSubmitReview = async () => {
    if (!submission || !reviewComment.trim()) return;

    setIsSubmitting(true);
    try {
      if (submission.review) {
        await dispatch(
          updateHomeworkReview({
            review_id: submission.review.id,
            comment: reviewComment.trim(),
          })
        ).unwrap();
      } else {
        await dispatch(
          createHomeworkReview({
            submission_id: submission.id,
            comment: reviewComment.trim(),
          })
        ).unwrap();
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Ошибка при создании/обновлении коментария:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setReviewComment("");
    onClose();
  };

  const handleDownloadFile = (filePath: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = filePath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ProfileModal
      isOpen={isOpen}
      onClose={handleClose}
      title={submission?.review ? "Редактировать коментарий" : "Добавить коментарий"}
      size="lg"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <h4>Ответ студента</h4>
          <TextArea
            value={submission?.content || "Ответ не предоставлен"}
            readOnly
            isShadow
            fullWidth
          />
        </div>

        {submission?.file_path && (
          <div>
            <h4>Файл</h4>
            <div className={styles.file__info}>
              <span className={styles.file__name}>
                {submission.file_path.split("/").pop()}
              </span>
              <button
                onClick={() =>
                  handleDownloadFile(
                    submission.file_path as string,
                    (submission.file_path as string).split("/").pop() || "file"
                  )
                }
                className={styles.download__button}
              >
                Скачать
              </button>
            </div>
          </div>
        )}

        <div>
          <h4>Дата отправки</h4>
          <div
            style={{
              padding: "10px",
              backgroundColor: "#f5f5f5",
              borderRadius: "4px",
            }}
          >
            {submission?.submitted_at
              ? new Date(submission.submitted_at).toLocaleString()
              : "Не отправлено"}
          </div>
        </div>

        <div>
          <h4>Коментарий преподавателя</h4>
          <TextArea
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="Введите коментарий на работу студента..."
            fullWidth
            rows={4}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          <button
            onClick={handleClose}
            className={styles.cancel__button}
            disabled={isSubmitting}
          >

            Отмена
          </button>
          <button
            onClick={handleSubmitReview}
            className={styles.save__button}
            disabled={isSubmitting || !reviewComment.trim()}
          >
            {isSubmitting
              ? "Сохранение..."
              : submission?.review
              ? "Обновить коментарий"
              : "Сохранить коментарий"}
          </button>
        </div>
      </div>
    </ProfileModal>
  );
};

export default TeacherReviewModal;
