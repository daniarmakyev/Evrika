import InputField from "@components/Fields/InputField";
import SelectField from "@components/Fields/SelectField";
import TextArea from "@components/Fields/TextAreaField";
import ProfileModal from "@components/ProfileModal";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import styles from "./styles.module.scss";
import { Course, Language, Level } from "src/consts/types";
import { useAppDispatch, useAppSelector } from "src/store/store";
import { updateCourse } from "src/store/courseGroup/courseGroup.action";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data: Course | null;
  languageOptions: Language[];
  levelOptions: Level[];
  onSuccess?: () => void;
};

interface EditCourseForm {
  name: string;
  price: number;
  language_id: number | string;
  level_id: number | string;
  description: string | null;
}

const EditModal = ({
  isOpen,
  onClose,
  data,
  languageOptions,
  levelOptions,
  onSuccess,
}: Props) => {
  const dispatch = useAppDispatch();
  const { updatingCourse, error } = useAppSelector(
    (state) => state.groupsCourses
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditCourseForm>({
    mode: "onBlur",
    defaultValues: {
      name: "",
      price: 0,
      language_id: "",
      level_id: "",
      description: "",
    },
  });

  useEffect(() => {
    if (isOpen && data) {
      const language = languageOptions.find(
        (lang) => lang.name === data.language_name
      );
      const level = levelOptions.find((lvl) => lvl.code === data.level_code);

      reset({
        name: data.name,
        price: data.price,
        language_id: language ? language.id : "",
        level_id: level ? level.id : "",
        description: data.description || null,
      });
    }
  }, [isOpen, data, reset, languageOptions, levelOptions]);

  const onSubmit = async (formData: EditCourseForm) => {
    if (!data) return;

    try {
      await dispatch(
        updateCourse({
          id: data.id,
          ...formData,
        })
      ).unwrap();

      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } catch (error) {
      console.error("Ошибка обновления курса:", error);
    }
  };

  return (
    <ProfileModal
      isOpen={isOpen}
      onClose={onClose}
      title="Редактировать курс"
      size="lg"
    >
      {data && (
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
          <div className={styles.formRow}>
            <SelectField
              {...register("language_id", { required: "Выберите язык" })}
              label="Язык"
              options={languageOptions.map((lang) => ({
                label: lang.name,
                value: lang.id,
              }))}
              placeholder="Выберите язык"
              fullWidth
              isShadow
            />
            {errors.language_id && (
              <span style={{ color: "red", fontSize: "14px" }}>
                {errors.language_id.message}
              </span>
            )}
          </div>

          <div className={styles.formRow}>
            <SelectField
              {...register("level_id", { required: "Выберите уровень" })}
              label="Уровень"
              options={levelOptions.map((lvl) => ({
                label: lvl.code,
                value: lvl.id,
              }))}
              placeholder="Выберите уровень"
              fullWidth
              isShadow
            />
            {errors.level_id && (
              <span style={{ color: "red", fontSize: "14px" }}>
                {errors.level_id.message}
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
            <div
              style={{ color: "red", fontSize: "14px", marginBottom: "10px" }}
            >
              {error}
            </div>
          )}

          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={updatingCourse}
            >
              {updatingCourse ? "Сохранение..." : "Сохранить"}
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={updatingCourse}
            >
              Отмена
            </button>
          </div>
        </form>
      )}
    </ProfileModal>
  );
};

export default EditModal;
