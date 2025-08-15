import InputField from "@components/Fields/InputField";
import SelectField from "@components/Fields/SelectField";
import ProfileModal from "@components/ProfileModal";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import styles from "./styles.module.scss";
import { useAppDispatch, useAppSelector } from "src/store/store";
import { createGroup } from "src/store/courseGroup/courseGroup.action";
import { clearError } from "src/store/courseGroup/courseGroup.slice";
import { CreateGroupForm, Teacher } from "src/consts/types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  teachers: Teacher[];
  courseOptions: { label: string; value: number | string }[];
};

const CreateGroupModal = ({
  isOpen,
  onClose,
  onSuccess,
  teachers,
  courseOptions,
}: Props) => {
  const dispatch = useAppDispatch();
  const { creatingGroup, error } = useAppSelector(
    (state) => state.groupsCourses
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<CreateGroupForm>({
    mode: "onBlur",
    defaultValues: {
      name: "",
      start_date: "",
      end_date: "",
      approximate_lesson_start: "",
      is_active: true,
      is_archived: false,
      course_id: courseOptions.length > 0 ? Number(courseOptions[0].value) : 1,
      teacher_id: teachers.length > 0 ? teachers[0].id : 1,
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
    if (isOpen) {
      reset({
        name: "",
        start_date: "",
        end_date: "",
        approximate_lesson_start: "",
        is_active: true,
        is_archived: false,
        course_id:
          courseOptions.length > 0 ? Number(courseOptions[0].value) : 1,
        teacher_id: teachers.length > 0 ? teachers[0].id : 1,
      });
      dispatch(clearError());
    }
  }, [isOpen, reset, dispatch, courseOptions, teachers]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleClose = () => {
    dispatch(clearError());
    onClose();
  };

  const onSubmit = async (formData: CreateGroupForm) => {
    try {
      let formattedTime = formData.approximate_lesson_start;
      if (formattedTime && !formattedTime.includes(":")) {
        formattedTime = "09:00";
      }

      const submitData = {
        name: formData.name.trim(),
        start_date: formData.start_date,
        end_date: formData.end_date,
        approximate_lesson_start: formattedTime,
        is_active: formData.is_active,
        is_archived: formData.is_archived,
        course_id: Number(formData.course_id),
        teacher_id: Number(formData.teacher_id),
      };

      await dispatch(createGroup(submitData)).unwrap();

      reset();

      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } catch (error) {
      console.error("Ошибка создания группы:", error);
      // Error is already handled by Redux, so we don't need to set it here
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

  // Validate date range
  const validateDateRange = (endDate: string, startDate: string) => {
    if (!startDate || !endDate) return true;
    return (
      new Date(endDate) >= new Date(startDate) ||
      "Дата окончания должна быть не раньше даты начала"
    );
  };

  return (
    <ProfileModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Создать новую группу"
      size="lg"
    >
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
              maxLength: {
                value: 100,
                message: "Название не должно превышать 100 символов",
              },
            })}
            label="Название группы"
            placeholder="Например: Английский-B1-0825-1"
            fullWidth
            isShadow
            style={{ width: "250px" }}
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
              validate: (value) => {
                const today = new Date().toISOString().split("T")[0];
                return value >= today || "Дата начала не может быть в прошлом";
              },
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
              validate: (value) =>
                validateDateRange(value, watch("start_date")),
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
              pattern: {
                value: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
                message: "Введите время в формате ЧЧ:ММ",
              },
            })}
            label="Время начала занятий"
            type="time"
            placeholder="09:00"
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
            disabled={isSubmitting || creatingGroup}
          >
            Отмена
          </button>
          <button
            type="submit"
            className={styles.saveButton}
            disabled={isSubmitting || creatingGroup}
          >
            {creatingGroup ? "Создание..." : "Создать группу"}
          </button>
        </div>
      </form>
    </ProfileModal>
  );
};

export default CreateGroupModal;
