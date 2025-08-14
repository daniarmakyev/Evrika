import ProfileModal from "@components/ProfileModal";
import TextArea from "@components/Fields/TextAreaField";
import InputField from "@components/Fields/InputField";
import React from "react";
import styles from "./styles.module.scss";

import { useForm, Controller } from "react-hook-form";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

interface FormData {
  lastName?: string;
  groups: string;
  phone: string;
  email: string;
  fullName?: string;
  description: string;
}

const AddTeacher: React.FC<Props> = ({ isOpen, onClose }) => {
  const { control } = useForm<FormData>({
    defaultValues: {
      fullName: "",
      groups: "",
      phone: "",
      email: "",
      description: "",
    },
  });

  return (
    <ProfileModal
      isOpen={isOpen}
      onClose={onClose}
      title="Добавление преподавателя"
      size="lg"
    >
      <form className={styles.form}>
        <Controller
          name="fullName"
          control={control}
          render={({ field }) => (
            <InputField
              {...field}
              label="Имя и фамилия"
              placeholder="Введите имя и фамилию"
            />
          )}
        />

        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <InputField
              {...field}
              // value={user.phone_number || ""}
              label="Телефон"
              placeholder="+7 (999) 999-99-99"
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <InputField
              {...field}
              // value={user.email}
              label="Почта"
              type="email"
              placeholder="example@mail.com"
            />
          )}
        />
        <Controller
          name="groups"
          control={control}
          render={({ field }) => (
            <InputField {...field} label="Выберите курс" />
          )}
        />
        <div style={{ width: "100%" }}>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextArea
                {...field}
                label="Добавить описание"
                fullWidth
                isShadow
              />
            )}
          />
        </div>
        <div className={styles.button_container}>
          <button className={styles.cancel__button} type="button">
            Отмена
          </button>
          <button className={styles.save__button}>Добавить</button>
        </div>
      </form>
    </ProfileModal>
  );
};

export default AddTeacher;
export const groups = [
  {
    label: "Английский язык",
    baseColor: "#4a90e2",
    options: [
      {
        label: "Английский язык A1-0925",
        value: "A1-0925",
        dotColor: "#9b59b6",
      },
      {
        label: "Английский язык B1-0925",
        value: "B1-0925",
        dotColor: "#2ecc71",
      },
      {
        label: "Английский язык B2-0925",
        value: "B2-0925",
        dotColor: "#f1c40f",
      },
      {
        label: "Английский язык C1-0925",
        value: "C1-0925",
        dotColor: "#e74c3c",
      },
    ],
  },
  {
    label: "Японский язык",
    baseColor: "#ff9800",
    options: [
      { label: "Японский язык N5-0925", value: "N5-0925", dotColor: "#ff9800" },
    ],
  },
];
