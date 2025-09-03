import ProfileModal from "@components/ProfileModal";
import TextArea from "@components/Fields/TextAreaField";
import React, { useEffect, useState } from "react";
import { HomeworkSubmission } from "src/consts/types";
import styles from "./styles.module.scss";
import { getUserById } from "src/store/user/user.action";
import { useAppDispatch } from "src/store/store";
import { useModal } from "@context/ModalContext";
import TeacherReviewModal from "src/app/profile/homework/teacher/TeacherReviewModal";
import InputField from "@components/Fields/InputField";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  homework?: any;
  submissions?: HomeworkSubmission[] | null;
  loading?: boolean;
};

const HomeworkViewModal: React.FC<Props> = ({
  isOpen,
  onClose,
  homework,
  submissions,
  loading,
}) => {
  const dispatch = useAppDispatch();
  const [students, setStudents] = useState<
    Record<number, { first_name: string; last_name: string }>
  >({});

  const reviewModal = useModal<{ submission: HomeworkSubmission }>("review");

  useEffect(() => {
    if (isOpen && submissions && submissions.length > 0) {
      const uniqueIds = Array.from(
        new Set(submissions.map((s) => s.student_id))
      );

      Promise.all(
        uniqueIds.map((id) =>
          dispatch(getUserById(id))
            .unwrap()
            .catch(() => null)
        )
      ).then((users) => {
        const studentsMap: Record<
          number,
          { first_name: string; last_name: string }
        > = {};
        users.forEach((user, idx) => {
          if (user) {
            studentsMap[uniqueIds[idx]] = {
              first_name: user.first_name,
              last_name: user.last_name,
            };
          }
        });
        setStudents(studentsMap);
      });
    }
  }, [isOpen, submissions, dispatch]);

  const handleDownloadFile = (filePath: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = filePath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenReviewModal = (submission: HomeworkSubmission) => {
    reviewModal.openModal({ submission });
  };

  const handleReviewSuccess = () => {
    reviewModal.closeModal();
  };

  return (
    <>
      <ProfileModal
        isOpen={isOpen}
        onClose={onClose}
        title="Просмотр домашнего задания"
        size="lg"
      >
        <div>
          <h4>Задание</h4>
          <TextArea
            value={
              homework?.homeworkData?.description || homework?.assignment || ""
            }
            readOnly
            isShadow
            fullWidth
          />
        </div>

        <div>
          <h4>Группа</h4>
          <div className={styles.info__field}>
            <InputField
              readOnly
              value={homework?.group || "Не указана"}
              isShadow
              fullWidth
            />
          </div>
        </div>

        <div>
          <h4>Дедлайн</h4>
          <div className={styles.info__field}>
            <InputField
              readOnly
              value={homework?.deadline || "Не указан"}
              isShadow
              fullWidth
            />
          </div>
        </div>

        <div>
          <h4>Ответы студентов</h4>
          {loading ? (
            <div>Загрузка...</div>
          ) : submissions && submissions.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className={styles.submission__card}
                >
                  <div style={{ marginBottom: 8 }}>
                    <b>Студент:</b>{" "}
                    {students[submission.student_id]
                      ? `${students[submission.student_id].first_name} ${
                          students[submission.student_id].last_name
                        } `
                      : students[submission.student_id] === undefined}
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <b>Ответ:</b>
                    <TextArea
                      value={submission.content || "Ответ не предоставлен"}
                      readOnly
                      isShadow
                      fullWidth
                    />
                  </div>
                  {submission.file_path && (
                    <div style={{ marginBottom: 8 }}>
                      <b>Файл:</b>{" "}
                      <span className={styles.file__name}>
                        {submission.file_path.split("/").pop()}
                      </span>
                      <button
                        onClick={() =>
                          handleDownloadFile(
                            submission.file_path as string,
                            (submission.file_path as string).split("/").pop() ||
                              "file"
                          )
                        }
                        className={styles.download__button}
                        style={{ marginLeft: 8 }}
                      >
                        Скачать
                      </button>
                    </div>
                  )}
                  <div style={{ marginBottom: 8 }}>
                    <b>Дата отправки:</b>{" "}
                    {submission.submitted_at
                      ? new Date(submission.submitted_at).toLocaleString()
                      : "Не отправлено"}
                  </div>

                  <div style={{ marginBottom: 8 }}>
                    <b>Коментарии:</b>
                    {submission.review ? (
                      <div style={{ marginTop: 8 }}>
                        <TextArea
                          value={submission.review.comment}
                          readOnly
                          isShadow
                          fullWidth
                        />
                      </div>
                    ) : (
                      <div>Коментарий не добавлен</div>
                    )}
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <button
                      onClick={() => handleOpenReviewModal(submission)}
                      className={styles.save__button}
                      style={{ fontSize: "14px", padding: "8px 16px" }}
                    >
                      {submission.review
                        ? "Редактировать коментарий"
                        : "Добавить коментарий"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>Нет отправленных работ</div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "20px",
          }}
        >
          <button onClick={onClose} className={styles.cancel__button}>
            Закрыть
          </button>
        </div>
      </ProfileModal>

      <TeacherReviewModal
        isOpen={reviewModal.isOpen}
        onClose={reviewModal.closeModal}
        submission={reviewModal.data?.submission}
        onSuccess={handleReviewSuccess}
      />
    </>
  );
};

export default HomeworkViewModal;
