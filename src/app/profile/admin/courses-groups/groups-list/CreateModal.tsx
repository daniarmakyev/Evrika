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
};

const CreateGroupModal = ({ isOpen, onClose, onSuccess, teachers }: Props) => {
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
      course_id: 1,
      teacher_id: 1,
    },
  });

  const teacherOptions = teachers.map(teacher => ({
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
        course_id: 1,
        teacher_id: 1,
      });
      dispatch(clearError());
    }
  }, [isOpen, reset, dispatch]);

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
      const timeWithSeconds = `${formData.approximate_lesson_start}:00.000Z`;

      const submitData = {
        name: formData.name,
        start_date: formData.start_date,
        end_date: formData.end_date,
        approximate_lesson_start: timeWithSeconds,
        is_active: formData.is_active,
        is_archived: formData.is_archived,
        course_id: formData.course_id,
        teacher_id: formData.teacher_id,
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
            })}
            label="Название группы"
            placeholder="Например: Английский-B1-0825-1"
            fullWidth
            isShadow
            style={{width:"250px"}}
          />
          {errors.name && (
            <span style={{ color: "red", fontSize: "14px" }}>
              {errors.name.message}
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
