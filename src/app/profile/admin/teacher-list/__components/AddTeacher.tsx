import ProfileModal from "@components/ProfileModal";
import InputField from "@components/Fields/InputField";
import React from "react";
import styles from "./styles.module.scss";
import { ChevronDown } from "lucide-react";
import { useAppSelector } from "src/store/store";
import {
  useRegisterTeacherMutation,
  useUpdateTeacherMutation,
  teacherApi,
} from "src/store/admin/teachers/teachers";
import type { Course } from "src/consts/types";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import type { AdminTeacher, BackendErrorResponse } from "src/consts/types";
import TextArea from "@components/Fields/TextAreaField";
import { useGetTeacherInfoQuery } from "src/store/admin/teachers/teachers";
import { $apiPrivate } from "src/consts/api";
import { useDispatch } from "react-redux";
import { Loader2 } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  teacher?: AdminTeacher | null | undefined;
  onTableLoading?: (loading: boolean) => void;
};

interface BaseForm {
  phone_number: string;
  email: string;
  full_name: string;
  role: string;
  description: string;
}

interface FormData extends BaseForm {
  group: string;
}
type CoursesByLanguage = Record<string, Course[]>;

type Group = {
  id: number;
  name: string;
  teacher_id?: number;
};

const AddTeacher: React.FC<Props> = ({
  isOpen,
  onClose,
  teacher,
  onTableLoading,
}) => {
  const [openDropdown, setOpenDropdown] = React.useState(false);
  const [openAccordion, setOpenAccordion] = React.useState<string | null>(null);
  const [groups, setGroups] = React.useState<Group[]>([]);
  const [selectedGroups, setSelectedGroups] = React.useState<number[]>([]);
  const { courses, groups: allGroups } = useAppSelector(
    (state) => state.groupsCourses
  );
  const user_id = teacher?.id?.toString() ?? "";

  const {
    data: teacherData,
    refetch,
    isLoading: isTeacherLoading,
  } = useGetTeacherInfoQuery({ user_id }, { skip: !user_id });
  const [registerTeacher, { isLoading: isRegisterLoading }] =
    useRegisterTeacherMutation();
  const [updateTeacher, { isLoading: isUpdateLoading }] =
    useUpdateTeacherMutation();
  const dispatch = useDispatch();

  const {
    control,
    reset,
    watch,
    register,
    setError,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>({
    defaultValues: {
      full_name: "",
      phone_number: "",
      email: "",
      role: "teacher",
      description: "",
    },
  });

  React.useEffect(() => {
    async function fetchGroups() {
      try {
        const res = await $apiPrivate.get("/group/");
        console.log("GROUPS RESPONSE", res.data);
        setGroups(res.data.groups || res.data || []);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        setGroups([]);
      }
    }
    fetchGroups();
  }, []);

  React.useEffect(() => {
    if (teacher?.id) {
      reset({
        full_name: teacher?.full_name,
        email: teacher?.email,
        phone_number: teacher?.phone_number,
        role: teacher?.role,
        description: teacherData?.description,
      });

      if (teacherData?.groups && teacherData.groups.length > 0) {
        setSelectedGroups(teacherData.groups.map((group) => group.id));
      }
    } else {
      reset({
        full_name: "",
        email: "",
        phone_number: "",
        role: "teacher",
        description: "",
      });
      setSelectedGroups([]);
    }
  }, [teacher, reset, teacherData?.description, teacherData?.groups]);

  const selectedCourse = watch("group");

  const handleGroupToggle = (groupId: number) => {
    setSelectedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      if (onTableLoading) onTableLoading(true);

      const selectedGroupId = !teacher
        ? allGroups?.find((g) => g.name === data.group)?.id ?? null
        : null;

      if (!teacher && !selectedGroupId) {
        alert("Нужно выбрать хотя бы одну группу");
        return;
      }

      const payload: BaseForm = {
        full_name: data.full_name,
        email: data.email,
        phone_number: data.phone_number,
        role: data.role,
        description: data.description,
      };

      if (teacher?.id) {
        await updateTeacher({
          teacherId: teacher?.id,
          teacherData: {
            full_name: data.full_name,
            email: data.email,
            phone_number: data.phone_number,
            description: data.description,
          },
        }).unwrap();

        const currentGroupIds = teacherData?.groups?.map((g) => g.id) || [];
        const toAdd = selectedGroups.filter(
          (id) => !currentGroupIds.includes(id)
        );
        const toRemove = currentGroupIds.filter(
          (id) => !selectedGroups.includes(id)
        );

        for (const groupId of toAdd) {
          await $apiPrivate.patch(`/group/${groupId}`, {
            teacher_id: Number(teacher.id),
          });
        }
        for (const groupId of toRemove) {
          await $apiPrivate.patch(`/group/${groupId}`, {
            teacher_id: null,
          });
        }

        const affectedTeacherIds = [
          teacher.id,
          ...currentGroupIds
            .filter((id) => !selectedGroups.includes(id))
            .map((groupId) => {
              const group = groups.find((g) => g.id === groupId);
              return group?.teacher_id;
            })
            .filter(Boolean),
        ];

        affectedTeacherIds.forEach((id) => {
          dispatch(
            teacherApi.util.invalidateTags([
              { type: "teacher", id: String(id) },
            ])
          );
        });

        dispatch(teacherApi.util.invalidateTags(["teachers"]));

        dispatch(
          teacherApi.util.invalidateTags([
            { type: "teacher", id: String(teacher.id) },
          ])
        );

        refetch();
      } else {
        await registerTeacher({
          groupId: selectedGroupId,
          teacherData: payload,
        }).unwrap();
        dispatch(teacherApi.util.invalidateTags(["teachers"]));
      }

      setTimeout(() => {
        if (onTableLoading) onTableLoading(false);
        reset();
        onClose();
      }, 1500);
    } catch (err) {
      if (onTableLoading) onTableLoading(false);
      const backendErr = err as BackendErrorResponse;
      const validationErrors = backendErr.data?.detail;

      if (Array.isArray(validationErrors)) {
        validationErrors.forEach((e) => {
          const field = e.loc[e.loc.length - 1] as keyof BaseForm;

          if (field in data) {
            setError(field, { message: e.msg });
          }
        });
      } else if (validationErrors) {
        // alert(
        //   typeof validationErrors === "string"
        //     ? validationErrors
        //     : "Ошибка валидации, попробуйте снова"
        // );
      } else {
        console.error(err);
        // alert("Ошибка, попробуйте позже");
      }
    }
  };

  const isFormLoading =
    isRegisterLoading || isUpdateLoading || isTeacherLoading;

  return (
    <ProfileModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        teacher?.id
          ? "Редактирование преподавателя"
          : "Добавление преподавателя"
      }
      size="lg"
    >
      {isFormLoading && (
        <div className={styles.loader_overlay}>
          <Loader2 className={styles.loader_spinner} />
          <span>
            {isTeacherLoading
              ? "Загрузка данных..."
              : isRegisterLoading
              ? "Создание преподавателя..."
              : isUpdateLoading
              ? "Сохранение изменений..."
              : ""}
          </span>
        </div>
      )}
      <form
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
        style={isFormLoading ? { pointerEvents: "none", opacity: 0.5 } : {}}
      >
        <div className={styles.input_container}>
          <InputField
            {...register("full_name", {
              required: "Имя и фамилия обязательны",
              minLength: { value: 2, message: "Минимум 2 символа" },
            })}
            isShadow
            fullWidth
            label="Имя и фамилия"
            placeholder="Введите имя и фамилию"
          />
          {errors.full_name && (
            <span style={{ color: "red", fontSize: "14px" }}>
              {errors.full_name.message}
            </span>
          )}
        </div>

        <div className={styles.input_container}>
          <InputField
            {...register("phone_number", {
              required: "Телефон обязателен",
              pattern: {
                value: /^\+996\d{9}$/,
                message: "Введите телефон в формате +996XXXXXXXXX",
              },
            })}
            isShadow
            fullWidth
            label="Телефон"
            placeholder="+996707707707"
          />
          {errors.phone_number && (
            <span style={{ color: "red", fontSize: "14px" }}>
              {errors.phone_number.message}
            </span>
          )}
        </div>

        <div className={styles.input_container}>
          <InputField
            {...register("email", {
              required: "Почта обязательна",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Введите корректный email",
              },
            })}
            isShadow
            fullWidth
            label="Почта"
            type="email"
            placeholder="example@mail.com"
          />
          {errors.email && (
            <span style={{ color: "red", fontSize: "14px" }}>
              {errors.email.message}
            </span>
          )}
        </div>

        {!teacher?.id && (
          <div className={styles.dropdown}>
            <button
              type="button"
              className={styles.dropdown__trigger}
              onClick={() => setOpenDropdown(!openDropdown)}
            >
              {selectedCourse ? selectedCourse : "Выберите группу"}
              <ChevronDown className={styles.dropdown__icon} />
            </button>

            {openDropdown && (
              <div className={styles.dropdown__content}>
                {Object.entries(
                  courses?.reduce((acc: CoursesByLanguage, course) => {
                    if (!acc[course.language_name]) {
                      acc[course.language_name] = [];
                    }
                    acc[course.language_name].push(course);
                    return acc;
                  }, {}) || {}
                ).map(([language, languageCourses]) => (
                  <div key={language}>
                    <button
                      type="button"
                      className={`${styles.dropdown__accordion_header} ${
                        openAccordion === language ? styles.open : ""
                      }`}
                      onClick={() =>
                        setOpenAccordion(
                          openAccordion === language ? null : language
                        )
                      }
                    >
                      {language} язык
                      <span>{openAccordion === language ? "-" : "+"}</span>
                    </button>

                    {openAccordion === language && (
                      <div
                        style={{ paddingLeft: "10px", paddingBlock: "10px" }}
                      >
                        <Controller
                          name="group"
                          control={control}
                          rules={{ required: "Нужно выбрать одну группу" }}
                          render={({ field }) => (
                            <div className={styles.dropdown__input_container}>
                              {allGroups
                                ?.filter((group) =>
                                  languageCourses.some(
                                    (course) => course.id === group.course_id
                                  )
                                )
                                .map((group) => (
                                  <label
                                    key={group.id}
                                    className={
                                      styles.dropdown__input_container_label
                                    }
                                  >
                                    <input
                                      className={styles.dropdown__checkbox}
                                      type="radio"
                                      value={group.name}
                                      checked={field.value === group.name}
                                      onChange={(e) =>
                                        field.onChange(e.target.value)
                                      }
                                    />
                                    <p>{group.name}</p>
                                  </label>
                                ))}
                            </div>
                          )}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {errors.group && (
              <span style={{ color: "red", fontSize: "14px" }}>
                {errors.group.message}
              </span>
            )}
          </div>
        )}

        {teacher?.id && (
          <div className={styles.input_container}>
            <label className={styles.input_container__label}>
              Группы (можно выбрать несколько)
            </label>
            <div className={styles.groups_checkbox_list}>
              {groups.map((group) => (
                <label key={group.id} className={styles.groups_checkbox_label}>
                  <input
                    type="checkbox"
                    checked={selectedGroups.includes(group.id)}
                    onChange={() => handleGroupToggle(group.id)}
                    style={{ marginRight: "8px" }}
                  />
                  <span>{group.name}</span>
                </label>
              ))}
            </div>
            {selectedGroups.length > 0 && (
              <div className={styles.groups_checkbox_count}>
                Выбрано групп: {selectedGroups.length}
              </div>
            )}
          </div>
        )}

        <div style={{ width: "100%" }} className={styles.textarea_container}>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextArea
                {...field}
                fullWidth
                isShadow
                label="Добавить описание"
              />
            )}
          />
        </div>

        <div className={styles.button_container}>
          <button
            className={styles.cancel__button}
            type="button"
            onClick={onClose}
          >
            Отмена
          </button>
          <button className={styles.save__button} disabled={isFormLoading}>
            {isFormLoading
              ? isTeacherLoading
                ? "Загрузка данных..."
                : isRegisterLoading
                ? "Создание преподавателя..."
                : isUpdateLoading
                ? "Сохранение изменений..."
                : "Сохраняем..."
              : teacher?.id
              ? "Сохранить"
              : "Добавить"}
          </button>
        </div>
      </form>
    </ProfileModal>
  );
};

export default AddTeacher;