import ProfileModal from "@components/ProfileModal";
import TextArea from "@components/Fields/TextAreaField";
import InputField from "@components/Fields/InputField";
import React from "react";
import { LessonListItem } from "src/consts/types";
import { formatTimeRangeShedule } from "src/consts/utilits";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data: LessonListItem | null;
};

const LessonInfoModal: React.FC<Props> = ({ isOpen, onClose, data }) => (
  <ProfileModal isOpen={isOpen} onClose={onClose} title="Урок" size="lg">
    {data && (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <h4>Название</h4>
          <InputField value={data.name} readOnly isShadow fullWidth />
        </div>
        {data.description && (
          <div>
            <h4>Описание</h4>
            <TextArea value={data.description} readOnly isShadow fullWidth />
          </div>
        )}
        <div>
          <h4>Группа</h4>
          <InputField value={data.group_name} readOnly isShadow fullWidth />
        </div>
        {data.lesson_start && data.lesson_end && (
          <div>
            <h4>Время проведения</h4>
            <InputField
              value={formatTimeRangeShedule(data.lesson_start, data.lesson_end)}
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

export default LessonInfoModal; 