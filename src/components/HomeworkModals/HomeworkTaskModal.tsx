import ProfileModal from "@components/ProfileModal";
import TextArea from "@components/Fields/TextAreaField";
import InputField from "@components/Fields/InputField";
import React from "react";
import { HomeworkTask } from "src/consts/types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data: HomeworkTask | null;
};

const HomeworkTaskModal: React.FC<Props> = ({ isOpen, onClose, data }) => (
  <ProfileModal isOpen={isOpen} onClose={onClose} title="Задание" size="lg">
    {data && (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <h4>Описание задания</h4>
          <TextArea value={data.description} readOnly isShadow fullWidth />
        </div>
        {data.deadline && (
          <div>
            <h4>Срок сдачи</h4>
            <InputField
              value={new Date(data.deadline).toLocaleDateString()}
              readOnly
              isShadow
              fullWidth
            />
          </div>
        )}
        {data.file_path && (
          <div>
            <h4>Материалы</h4>
            <TextArea
              value={data.file_path}
              readOnly
              isShadow
              fullWidth
              type="file"
            />
          </div>
        )}
      </div>
    )}
  </ProfileModal>
);

export default HomeworkTaskModal; 