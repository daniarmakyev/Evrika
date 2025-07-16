import ProfileModal from "@components/ProfileModal";
import TextArea from "@components/Fields/TextAreaField";
import InputField from "@components/Fields/InputField";
import Link from "next/link";
import React from "react";
import { HomeworkSubmission, HomeworkTask } from "src/consts/types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data: { homework: { homeworkData: HomeworkTask }; submission: HomeworkSubmission } | null;
  modalLinkClass?: string;
};

const HomeworkSubmissionModal: React.FC<Props> = ({ isOpen, onClose, data, modalLinkClass }) => (
  <ProfileModal isOpen={isOpen} onClose={onClose} title="Загруженное задание" size="lg">
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
        {data.submission?.content ? (
          <div>
            <h4>Ответ студента</h4>
            <TextArea
              value={data.submission.content}
              readOnly
              isShadow
              fullWidth
            />
          </div>
        ) : null}
        {data.submission?.file_path ? (
          <div>
            <h4>Загруженный файл</h4>
            <Link href={data.submission.file_path} className={modalLinkClass}>
              <InputField
                style={{ cursor: "pointer" }}
                value={data.submission.file_path}
                readOnly
                isShadow
                fullWidth
              />
            </Link>
          </div>
        ) : null}
        {data.submission?.submitted_at && (
          <div>
            <h4>Дата отправки</h4>
            <InputField
              value={new Date(data.submission.submitted_at).toLocaleDateString()}
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

export default HomeworkSubmissionModal; 