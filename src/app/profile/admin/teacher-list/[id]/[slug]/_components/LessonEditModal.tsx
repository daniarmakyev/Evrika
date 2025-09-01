import ProfileModal from "@components/ProfileModal";
import InputField from "@components/Fields/InputField";
import TextArea from "@components/Fields/TextAreaField";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "src/store/store";
import { getClassrooms, deleteLesson } from "src/store/lesson/lesson.action";
import { clearError } from "src/store/lesson/lesson.slice";
import {  getGroup } from "src/store/user/user.action";
import { LessonShedule } from "src/consts/types";
import { useEditLessonScheduleMutation } from "src/store/admin/teachers/teachers";

interface LessonSheduleExtended extends LessonShedule {
  group_id?: number;
}
import styles from "./modal.module.scss";

type LessonFormData = {
  name: string;
  description: string;
  link: string;
  timeFrom: string;
  timeTo: string;
  date: string;
  classrooms: string | number;
  group_id: number | undefined;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  lesson?: LessonSheduleExtended | null;
  user_id: number;
};

const LessonEditModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
  lesson,
  user_id,
}) => {
  const dispatch = useAppDispatch();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editLessonSchedule] = useEditLessonScheduleMutation();

  const { error, loading } = useAppSelector((state) => state.lesson);
  const { classrooms, loading: classroomsLoading } = useAppSelector(
    (state) => state.lesson
  );
  const {
    user,
    groups,
    loading: userLoading,
  } = useAppSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LessonFormData>({
    defaultValues: {
      name: "",
      description: "",
      link: "",
      timeFrom: "",
      timeTo: "",
      date: "",
      classrooms: "",
      group_id: undefined,
    },
  });

  console.log(lesson, "LESSON");

  useEffect(() => {
    if (isOpen && lesson) {
      setValue("name", lesson.name || "");
      setValue("description", lesson.description || "");
      setValue("link", lesson.link || "");
      setValue("timeFrom", lesson.lesson_start || "");
      setValue("timeTo", lesson.lesson_end || "");
      setValue("classrooms", lesson.classroom?.id || "");
      setValue("date", lesson.day || "");
      setValue("group_id", lesson?.group_id || undefined);
    }
  }, [isOpen, lesson, setValue]);

  useEffect(() => {
    if (isOpen) {
      // if (!user) {
      //   dispatch(getUser());
      // }

      if (!classrooms) {
        dispatch(getClassrooms());
      }

      if (!groups) {
        const userRole = localStorage.getItem("role");
        if (userRole) {
          dispatch(getGroup({}));
        }
      }
    }
  }, [isOpen, user, classrooms, groups, dispatch]);

  const handleClose = () => {
    reset();
    setShowDeleteConfirm(false);
    setIsDeleting(false);
    dispatch(clearError());
    onClose();
  };

  const onSubmit = async (formData: LessonFormData) => {
    try {
      if (!user?.id || !lesson?.id) {
        throw new Error(
          "Не удалось получить данные для обновления урока. Попробуйте перезагрузить страницу."
        );
      }

      const lessonData = {
        name: formData.name,
        description: formData.description,
        link: formData.link,
        day: formData.date,
        lesson_start: formData.timeFrom,
        lesson_end: formData.timeTo,
        teacher_id: user_id,
        classroom_id: Number(formData.classrooms),
        group_id: lesson?.group_id,
        passed: false,
      };

      // const groupId = lesson.group_id ;

      // if (!groupId) {
      //   throw new Error("Не удалось определить группу для урока");
      // }

      await editLessonSchedule({
        lesson_id: lesson.id,
        lessonData,
      }).unwrap();

      if (onSuccess) {
        onSuccess();
      }

      reset();
      onClose();
    } catch (error) {
      console.error("Error updating lesson:", error);

      const err = error as { status?: number; data?: unknown };
      if (err.status === 403) {
        alert(
          typeof err.data === "string"
            ? err.data
            : "У вас нет прав для изменения этого урока (403 Forbidden)."
        );
      } else {
        alert("Произошла ошибка при обновлении урока.");
      }
    }
  };

  const handleDeleteLesson = async () => {
    if (!lesson?.id) {
      console.error("Lesson ID not found");
      return;
    }

    setIsDeleting(true);
    try {
      await dispatch(deleteLesson(lesson.id)).unwrap();

      if (onSuccess) {
        onSuccess();
      }

      reset();
      setShowDeleteConfirm(false);
      onClose();
    } catch (error) {
      console.error("Error deleting lesson:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const isDataLoading = userLoading || (!user && isOpen);

  return (
    <ProfileModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Редактирование урока"
      size="lg"
    >
      {isDataLoading ? (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <div>Загрузка данных...</div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.lessonForm}>
          {error && <div className={styles.errorMessage}>{error}</div>}

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
              <InputField
                {...register("link")}
                placeholder="https://example.com"
                fullWidth
                isShadow
              />
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

              <div className={styles.fieldGroup}>
                <h4>Выберите кабинет</h4>
                <select
                  {...register("classrooms", {
                    required: "Выбор кабинета обязателен",
                  })}
                  className={styles.selectField}
                  disabled={classroomsLoading}
                >
                  <option value="">
                    {classroomsLoading ? "Загрузка..." : "Выберите кабинет"}
                  </option>
                  {classrooms?.map((classroom) => (
                    <option key={classroom.id} value={classroom.id}>
                      {classroom.name}
                    </option>
                  ))}
                </select>
                {errors.classrooms && (
                  <span className={styles.errorMessage}>
                    {errors.classrooms?.message}
                  </span>
                )}
              </div>
            </div>

            <div className={styles.rightFields}>
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
          {showDeleteConfirm && (
            <div className={styles.deleteConfirmation}>
              <div className={styles.confirmationMessage}>
                <h4>Подтвердите удаление</h4>
                <p>
                  Вы уверены, что хотите удалить этот урок? Это действие нельзя
                  отменить.
                </p>
              </div>
              <div className={styles.confirmationButtons}>
                <button
                  type="button"
                  className={styles.cancel__button}
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                >
                  Отмена
                </button>
                <button
                  type="button"
                  className={styles.delete__confirm__button}
                  onClick={handleDeleteLesson}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Удаление..." : "Удалить"}
                </button>
              </div>
            </div>
          )}

          <div className={styles.buttonContainer}>
            <div className={styles.leftButtons}>
              <button
                type="button"
                className={styles.delete__button}
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isSubmitting || loading || !user || showDeleteConfirm}
              >
                Удалить урок
              </button>
            </div>
            <div className={styles.rightButtons}>
              <button
                type="submit"
                className={styles.save__button}
                disabled={isSubmitting || loading || !user || showDeleteConfirm}
              >
                {isSubmitting || loading ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </div>
        </form>
      )}
    </ProfileModal>
  );
};

export default LessonEditModal;
