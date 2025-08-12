import InputField from "@components/Fields/InputField";
import SelectField from "@components/Fields/SelectField";
import TextArea from "@components/Fields/TextAreaField";
import ProfileModal from "@components/ProfileModal";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import styles from "./styles.module.scss";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  languageOptions: { value: string; label: string }[];
  onSuccess?: () => void;
};

interface CreateCourseForm {
  name: string;
  price: number;
  language_name: string;
  level_code: string;
  description: string;
}

const CreateCourseModal = ({
  isOpen,
  onClose,
  languageOptions,
  onSuccess,
}: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<CreateCourseForm>({
    mode: "onBlur",
    defaultValues: {
      name: "",
      price: 0,
      language_name: "",
      level_code: "",
      description: "",
    },
  });

  const levelOptions = [
    { value: "A1", label: "A1 - Начинающий" },
    { value: "A2", label: "A2 - Элементарный" },
    { value: "B1", label: "B1 - Средний" },
    { value: "B2", label: "B2 - Выше среднего" },
    { value: "C1", label: "C1 - Продвинутый" },
    { value: "C2", label: "C2 - Профессиональный" },
  ];

  useEffect(() => {
    if (isOpen) {
      reset({
        name: "",
        price: 0,
        language_name: "",
        level_code: "",
        description: "",
      });
    }
  }, [isOpen, reset]);

  const onSubmit = async (formData: CreateCourseForm) => {
    try {
      console.log("Данные для создания курса:", formData);

      reset();

      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } catch (error) {
      console.error("Ошибка создания курса:", error);
    }
  };

  return (
    <ProfileModal
      isOpen={isOpen}
      onClose={onClose}
      title="Создать новый курс"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className={styles.modal__form}>
        {/* <div className={styles.formRow}>
          <InputField
            {...register("name", {
              required: "Название курса обязательно",
              minLength: {
                value: 2,
                message: "Название должно содержать минимум 2 символа",
              },
            })}
            label="Название курса"
            placeholder="Введите название курса"
            fullWidth
            isShadow
          />
          {errors.name && (
            <span style={{ color: "red", fontSize: "14px" }}>
              {errors.name.message}
            </span>
          )}
        </div> */}

        <div className={styles.formRow}>
          <SelectField
            {...register("language_name", {
              required: "Выберите язык",
            })}
            label="Язык"
            options={languageOptions.slice(1)}
            placeholder="Выберите язык"
            isShadow
          />
          {errors.language_name && (
            <span style={{ color: "red", fontSize: "14px" }}>
              {errors.language_name.message}
            </span>
          )}
        </div>

        <div className={styles.formRow}>
          <SelectField
            {...register("level_code", {
              required: "Выберите уровень",
            })}
            label="Уровень"
            options={levelOptions}
            placeholder="Выберите уровень"
            isShadow
          />
          {errors.level_code && (
            <span style={{ color: "red", fontSize: "14px" }}>
              {errors.level_code.message}
            </span>
          )}
        </div>
        <div className={styles.formRow}>
          <InputField
            {...register("price", {
              required: "Цена обязательна",
              min: {
                value: 1,
                message: "Цена должна быть больше 0",
              },
              valueAsNumber: true,
            })}
            label="Цена за месяц (сом)"
            type="number"
            placeholder="0"
            fullWidth
            isShadow
          />
          {errors.price && (
            <span style={{ color: "red", fontSize: "14px" }}>
              {errors.price.message}
            </span>
          )}
        </div>
        <div className={styles.formRowTextArea}>
          <TextArea
            {...register("description", {
              required: "Описание обязательно",
              minLength: {
                value: 1,
                message: "Описание должно содержать минимум 1 символ",
              },
            })}
            label="Описание"
            placeholder="Введите описание курса..."
            fullWidth
            rows={4}
            isShadow
          />
          {errors.description && (
            <span style={{ color: "red", fontSize: "14px" }}>
              {errors.description.message}
            </span>
          )}
        </div>

        <div className={styles.formActions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onClose}
            disabled={isSubmitting}
          >
            Отмена
          </button>
          <button
            type="submit"
            className={styles.saveButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Создание..." : "Создать курс"}
          </button>
        </div>
      </form>
    </ProfileModal>
  );
};

export default CreateCourseModal;
