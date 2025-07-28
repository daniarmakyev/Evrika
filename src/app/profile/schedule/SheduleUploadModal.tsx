import ProfileModal from "@components/ProfileModal";
import InputField from "@components/Fields/InputField";
import TextArea from "@components/Fields/TextAreaField";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "src/store/store";
import { createLesson, getClassrooms } from "src/store/lesson/lesson.action";
import { clearError } from "src/store/lesson/lesson.slice";
import { getUser, getGroup } from "src/store/user/user.action";
import styles from "./modal.module.scss";

type LessonFormData = {
  name: string;
  description: string;
  link: string;
  timeFrom: string;
  timeTo: string;
  groups: string;
  date: string;
  classrooms: string | number;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  groupId?: number;
};

const LessonCreateModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
  groupId,
}) => {
  const dispatch = useAppDispatch();

  // Redux state
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
      classrooms: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (!user) {
        dispatch(getUser());
      }

      if (!classrooms) {
        dispatch(getClassrooms());
      }

      if (!groupId && !groups) {
        const userRole = localStorage.getItem("role");
        if (userRole) {
          dispatch(getGroup(userRole));
        }
      }
    }
  }, [isOpen, user, classrooms, groups, groupId, dispatch]);

  const handleClose = () => {
    reset();
    dispatch(clearError());
    onClose();
  };

  const onSubmit = async (formData: LessonFormData) => {
    try {
      if (!user?.id) {
        throw new Error(
          "Не удалось получить ID преподавателя. Попробуйте перезагрузить страницу."
        );
      }

      const lessonData = {
        name: formData.name,
        description: formData.description,
        link: formData.link || undefined,
        day: formData.date,
        lesson_start: formData.timeFrom,
        lesson_end: formData.timeTo,
        teacher_id: user.id,
        classroom_id: Number(formData.classrooms),
        passed: false,
      };

      const targetGroupId = groupId || Number(formData.groups);

      if (!targetGroupId) {
        throw new Error("Выберите группу для урока");
      }

      await dispatch(
        createLesson({
          groupId: targetGroupId,
          body: lessonData,
        })
      ).unwrap();

      if (onSuccess) {
        onSuccess();
      }

      reset();
      onClose();
    } catch (error) {
      console.error("Error creating lesson:", error);
    }
  };

  const availableGroups = groups?.groups || [];

  const isDataLoading = userLoading || (!user && isOpen);

  return (
    <ProfileModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Создание урока"
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
              {!groupId && (
                <div className={styles.fieldGroup}>
                  <h4>Выберите группы</h4>
                  <select
                    {...register("groups", {
                      required: "Выбор группы обязателен",
                    })}
                    className={styles.selectField}
                  >
                    <option value="">Выберите группу</option>
                    {availableGroups.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                  {errors.groups && (
                    <span className={styles.errorMessage}>
                      {errors.groups.message}
                    </span>
                  )}
                </div>
              )}

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
              disabled={isSubmitting || loading || !user}
            >
              {isSubmitting || loading ? "Создание..." : "Создать"}
            </button>
          </div>
        </form>
      )}
    </ProfileModal>
  );
};

export default LessonCreateModal;
