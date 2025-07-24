import ProfileModal from "@components/ProfileModal";
import InputField from "@components/Fields/InputField";
import TextArea from "@components/Fields/TextAreaField";
import React from "react";
import { useForm } from "react-hook-form";
import styles from "./modal.module.scss";

type LessonFormData = {
  name: string;
  description: string;
  link: string;
  timeFrom: string;
  timeTo: string;
  groups: string;
  date: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  //   data: any;
};

const LessonCreateModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LessonFormData>({
    defaultValues: {
      name: "",
      description: "",
      link: "",
      timeFrom: "",
      timeTo: "",
      groups: "",
      date: "",
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (formData: LessonFormData) => {
    try {
      console.log("Lesson data:", formData);
      reset();
      onClose();
    } catch (error) {
      console.error("Error creating lesson:", error);
    }
  };

  return (
    <ProfileModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Создание урока"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className={styles.lessonForm}>
        <div className={styles.fullWidthFields}>
          <div className={styles.fieldGroup}>
            <h4>Тема урока</h4>
            <InputField
              {...register("name", {
                required: "Тема урока обязательна для заполнения",
              })}
              placeholder="Введите тему урока"
              fullWidth
              isShadow
              error={errors.name?.message}
            />
          </div>

          <div className={styles.fieldGroup}>
            <h4>Описание</h4>
            <TextArea
              {...register("description")}
              placeholder="Введите описание урока (необязательно)"
              fullWidth
              isShadow
            />
          </div>

          <div className={styles.fieldGroup}>
            <h4>Ссылка</h4>
            <InputField placeholder="https://example.com" fullWidth isShadow />
          </div>
        </div>

        <div className={styles.flexFields}>
          <div className={styles.timeFields}>
            <div className={styles.fieldGroup}>
              <h4>Время начала</h4>
              <InputField
                {...register("timeFrom", {
                  required: "Время начала обязательно",
                })}
                type="time"
                isShadow
                error={errors.timeFrom?.message}
              />
            </div>

            <div className={styles.fieldGroup}>
              <h4>Время окончания</h4>
              <InputField
                {...register("timeTo", {
                  required: "Время окончания обязательно",
                  validate: (value, { timeFrom }) => {
                    if (timeFrom && value && value <= timeFrom) {
                      return "Время окончания должно быть позже времени начала";
                    }
                    return true;
                  },
                })}
                type="time"
                isShadow
                error={errors.timeTo?.message}
              />
            </div>
          </div>

          <div className={styles.rightFields}>
            <div className={styles.fieldGroup}>
              <h4>Выберите группы</h4>
              <select
                {...register("groups", {
                  required: "Выбор группы обязателен",
                })}
                className={styles.selectField}
              >
                <option value="">Выберите группу</option>
                <option value="group1">Группа 1</option>
                <option value="group2">Группа 2</option>
                <option value="group3">Группа 3</option>
              </select>
              {errors.groups && (
                <span className={styles.errorMessage}>
                  {errors.groups.message}
                </span>
              )}
            </div>

            <div className={styles.fieldGroup}>
              <h4>Дата</h4>
              <InputField
                {...register("date", {
                  required: "Дата обязательна для заполнения",
                })}
                type="date"
                isShadow
                error={errors.date?.message}
              />
            </div>
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <button
            type="submit"
            className={styles.save__button}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Создание..." : "Создать"}
          </button>
        </div>
      </form>
    </ProfileModal>
  );
};

export default LessonCreateModal;
