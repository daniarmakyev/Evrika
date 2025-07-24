import ProfileModal from "@components/ProfileModal";
import TextArea from "@components/Fields/TextAreaField";
import React from "react";
import { HomeworkSubmission } from "src/consts/types";
import styles from "./styles.module.scss";

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
      onClose={onClose}
      title="Просмотр домашнего задания"
      size="lg"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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
            {homework?.group || "Не указана"}
          </div>
        </div>

        <div>
          <h4>Дедлайн</h4>
          <div className={styles.info__field}>
            {homework?.deadline || "Не указан"}
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
                  style={{
                    border: "1px solid #eee",
                    borderRadius: 8,
                    padding: 16,
                  }}
                >
                  <div style={{ marginBottom: 8 }}>
                    <b>Студент ID:</b> {submission.student_id}
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
                            (submission.file_path as string).split("/").pop() || "file"
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
                    <b>Статус:</b>{" "}
                    <span
                      style={{
                        color: submission ? "green" : "red",
                        fontWeight: 600,
                        fontSize: "14px",
                      }}
                    >
                      {submission ? "Отправлено" : "В ожидании"}
                    </span>
                  </div>
                  {submission.review && (
                    <div>
                      <b>Комментарий:</b>
                      <TextArea
                        value={submission.review}
                        readOnly
                        isShadow
                        fullWidth
                      />
                    </div>
                  )}
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
      </div>
    </ProfileModal>
  );
};

export default HomeworkViewModal;
