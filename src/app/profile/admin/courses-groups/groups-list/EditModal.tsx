import InputField from "@components/Fields/InputField";
import SelectField from "@components/Fields/SelectField";
import ProfileModal from "@components/ProfileModal";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import styles from "./styles.module.scss";
import { useAppDispatch, useAppSelector } from "src/store/store";
import { updateGroup } from "src/store/courseGroup/courseGroup.action";
import { clearError } from "src/store/courseGroup/courseGroup.slice";
import { Group, Teacher } from "src/consts/types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data: Group | null;
  onSuccess?: () => void;
  teachers: Teacher[];
  courseOptions: { label: string; value: number | string }[];
};

interface EditGroupForm {
  name: string;
  start_date: string;
  end_date: string;
  approximate_lesson_start: string;
  is_active: boolean;
  is_archived: boolean;
  course_id: number;
  teacher_id: number;
}

const EditGroupModal = ({
  isOpen,
  onClose,
  data,
  onSuccess,
  teachers,
  courseOptions,
}: Props) => {
  const dispatch = useAppDispatch();
  const { updatingGroup, error } = useAppSelector(
    (state) => state.groupsCourses
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<EditGroupForm>({
    mode: "onBlur",
    defaultValues: {
      name: "",
      start_date: "",
      end_date: "",
      approximate_lesson_start: "",
      is_active: true,
      is_archived: false,
      course_id: 1,
      teacher_id: 1,
    },
  });

  const teacherOptions = teachers.map((teacher) => ({
    value: teacher.id.toString(),
    label: `${teacher.first_name} ${teacher.last_name}`,
  }));

  const statusOptions = [
    { value: "active", label: "Активная" },
    { value: "inactive", label: "Неактивная" },
    { value: "archived", label: "Архивная" },
  ];

  const watchedStatus = watch("is_active");
  const watchedArchived = watch("is_archived");

  useEffect(() => {
    if (isOpen && data) {
      reset({
        name: data.name,
        start_date: data.start_date,
        end_date: data.end_date,
        approximate_lesson_start: data.approximate_lesson_start.substring(0, 5),
        is_active: data.is_active,
        is_archived: data.is_archived,
        course_id: data.course_id,
        teacher_id: data.teacher_id,
      });
      dispatch(clearError());
    }
  }, [isOpen, data, reset, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleClose = () => {
    dispatch(clearError());
    onClose();
  };

  const onSubmit = async (formData: EditGroupForm) => {
    if (!data) return;

    try {
      const timeWithSeconds = `${formData.approximate_lesson_start}:00.000Z`;

      const submitData = {
        ...formData,
        approximate_lesson_start: timeWithSeconds,
      };

      await dispatch(
        updateGroup({
          id: data.id,
          updateData: submitData,
        })
      ).unwrap();

      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } catch (error) {
      console.error("Ошибка обновления группы:", error);
    }
  };

  const getCurrentStatus = () => {
    if (watchedArchived) return "archived";
    if (watchedStatus) return "active";
    return "inactive";
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;

    switch (status) {
      case "active":
        setValue("is_active", true);
        setValue("is_archived", false);
        break;
      case "archived":
        setValue("is_active", false);
        setValue("is_archived", true);
        break;
      case "inactive":
        setValue("is_active", false);
        setValue("is_archived", false);
        break;
    }
  };

  return (
    <ProfileModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Редактировать группу"
      size="lg"
    >
      {data && (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.modal__form}>
          {error && (
            <div
              style={{
                color: "red",
                backgroundColor: "#ffebee",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ffcdd2",
                marginBottom: "20px",
              }}
            >
              {error}
            </div>
          )}

          <div className={styles.formRow}>
            <InputField
              {...register("name", {
                required: "Название группы обязательно",
                minLength: {
                  value: 2,
                  message: "Название должно содержать минимум 2 символа",
                },
              })}
              label="Название группы"
              placeholder="Введите название группы"
              fullWidth
              isShadow
              style={{ width: "180px" }}
            />
            {errors.name && (
              <span style={{ color: "red", fontSize: "14px" }}>
                {errors.name.message}
              </span>
            )}
          </div>

          <div className={styles.formRow}>
            <SelectField
              {...register("course_id", {
                required: "Выберите курс",
                valueAsNumber: true,
              })}
              label="Курс"
              options={courseOptions}
              placeholder="Выберите курс"
              fullWidth
              isShadow
            />
            {errors.course_id && (
              <span style={{ color: "red", fontSize: "14px" }}>
                {errors.course_id.message}
              </span>
            )}
          </div>

          <div className={styles.formRow}>
            <SelectField
              {...register("teacher_id", {
                required: "Выберите преподавателя",
                valueAsNumber: true,
              })}
              label="Преподаватель"
              options={teacherOptions}
              placeholder="Выберите преподавателя"
              fullWidth
              isShadow
            />
            {errors.teacher_id && (
              <span style={{ color: "red", fontSize: "14px" }}>
                {errors.teacher_id.message}
              </span>
            )}
          </div>

          <div className={styles.formRow}>
            <InputField
              {...register("start_date", {
                required: "Дата начала обязательна",
              })}
              label="Дата начала"
              type="date"
              fullWidth
              isShadow
            />
            {errors.start_date && (
              <span style={{ color: "red", fontSize: "14px" }}>
                {errors.start_date.message}
              </span>
            )}
          </div>

          <div className={styles.formRow}>
            <InputField
              {...register("end_date", {
                required: "Дата окончания обязательна",
              })}
              label="Дата окончания"
              type="date"
              fullWidth
              isShadow
            />
            {errors.end_date && (
              <span style={{ color: "red", fontSize: "14px" }}>
                {errors.end_date.message}
              </span>
            )}
          </div>

          <div className={styles.formRow}>
            <InputField
              {...register("approximate_lesson_start", {
                required: "Время начала занятий обязательно",
              })}
              label="Время начала занятий"
              type="time"
              fullWidth
              isShadow
            />
            {errors.approximate_lesson_start && (
              <span style={{ color: "red", fontSize: "14px" }}>
                {errors.approximate_lesson_start.message}
              </span>
            )}
          </div>

          <div className={styles.formRow}>
            <SelectField
              label="Статус группы"
              options={statusOptions}
              placeholder="Выберите статус"
              value={getCurrentStatus()}
              onChange={handleStatusChange}
              fullWidth
              isShadow
            />
          </div>

          <input type="hidden" {...register("is_active")} />
          <input type="hidden" {...register("is_archived")} />

          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleClose}
              disabled={isSubmitting || updatingGroup}
            >
              Отмена
            </button>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={isSubmitting || updatingGroup}
            >
              {updatingGroup ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </form>
      )}
    </ProfileModal>
  );
};

export default EditGroupModal;
