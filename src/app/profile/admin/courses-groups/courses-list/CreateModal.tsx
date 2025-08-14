import InputField from "@components/Fields/InputField";
import SelectField from "@components/Fields/SelectField";
import TextArea from "@components/Fields/TextAreaField";
import ProfileModal from "@components/ProfileModal";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import styles from "./styles.module.scss";
import { useAppDispatch, useAppSelector } from "src/store/store";
import { createCourse } from "src/store/courseGroup/courseGroup.action";
import { Language, Level } from "src/consts/types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  languageOptions: Language[];
  levelOptions: Level[];
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
  levelOptions,
  onSuccess,
}: Props) => {
  const dispatch = useAppDispatch();
  const { creatingCourse, error } = useAppSelector(
    (state) => state.groupsCourses
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
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
      await dispatch(createCourse(formData)).unwrap();

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
        <div className={styles.formRow}>
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
        </div>

        <div className={styles.formRow}>
          <SelectField
            {...register("language_name", {
              required: "Выберите язык",
            })}
            label="Язык"
            options={languageOptions.map((lang) => ({
              value: lang.id,
              label: lang.name,
            }))}
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
            options={levelOptions.map((level) => ({
              value: level.id,
              label: level.code,
            }))}
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
            {...register("description")}
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

        {error && (
          <div style={{ color: "red", fontSize: "14px", marginBottom: "10px" }}>
            {error}
          </div>
        )}

        <div className={styles.formActions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onClose}
            disabled={creatingCourse}
          >
            Отмена
          </button>
          <button
            type="submit"
            className={styles.saveButton}
            disabled={creatingCourse}
          >
            {creatingCourse ? "Создание..." : "Создать курс"}
          </button>
        </div>
      </form>
    </ProfileModal>
  );
};

export default CreateCourseModal;
