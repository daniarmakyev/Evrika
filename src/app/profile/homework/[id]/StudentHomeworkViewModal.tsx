import ProfileModal from "@components/ProfileModal";
import TextArea from "@components/Fields/TextAreaField";
import InputField from "@components/Fields/InputField";
import Link from "next/link";
import React from "react";
import { HomeworkTask } from "src/consts/types";

interface StudentHomeworkTableItem {
  id: number;
  group: string;
  lesson: string;
  task: string;
  note: string;
  submittedAt: string;
  homeworkId: number;
  lessonId: number;
  groupId: number;
  homeworkData: HomeworkTask;
  submissionData: {
    id: number;
    homework_id: number;
    student_id: number;
    file_path: string | null;
    content: string;
    submitted_at: string;
    review: {
      id: number;
      comment: string;
    } | null;
  };
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data: {
    homework: StudentHomeworkTableItem;
  } | null;
  modalLinkClass?: string;
};

const StudentHomeworkViewModal: React.FC<Props> = ({
  isOpen,
  onClose,
  data,
  modalLinkClass,
}) => (
  <ProfileModal
    isOpen={isOpen}
    onClose={onClose}
    title="Домашнее задание студента"
    size="lg"
  >
    {data && (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <h4>Описание задания</h4>
          <TextArea
            value={data.homework?.homeworkData?.description || ""}
            readOnly
            isShadow
            fullWidth
          />
        </div>
        
        {data.homework?.submissionData?.content ? (
          <div>
            <h4>Ответ студента</h4>
            <TextArea
              value={data.homework.submissionData.content}
              readOnly
              isShadow
              fullWidth
            />
          </div>
        ) : null}
        
        {!data.homework?.submissionData?.file_path?.includes("blob") && 
         data.homework?.submissionData?.file_path !== null ? (
          <div>
            <h4>Загруженный файл</h4>
            <Link
              href={data.homework.submissionData.file_path || "#"}
              className={modalLinkClass}
              target="_blank"
              rel="noopener noreferrer"
            >
              <InputField
                style={{ cursor: "pointer" }}
                value={data.homework.submissionData.file_path || ""}
                readOnly
                isShadow
                fullWidth
                type="text"
              />
            </Link>
          </div>
        ) : null}
        
        {data.homework?.submissionData?.submitted_at && (
          <div>
            <h4>Дата отправки</h4>
            <InputField
              value={new Date(
                data.homework.submissionData.submitted_at
              ).toLocaleDateString()}
              readOnly
              isShadow
              fullWidth
            />
          </div>
        )}
        
        {data.homework?.submissionData?.review?.comment && (
          <div>
            <h4>Комментарий учителя</h4>
            <TextArea
              value={data.homework.submissionData.review.comment}
              readOnly
              isShadow
              fullWidth
            />
          </div>
        )}
      </div>
    )}
  </ProfileModal>
);

export default StudentHomeworkViewModal;