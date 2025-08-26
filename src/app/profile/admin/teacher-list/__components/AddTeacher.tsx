import ProfileModal from "@components/ProfileModal";
import InputField from "@components/Fields/InputField";
import React from "react";
import styles from "./styles.module.scss";
import { ChevronDown } from "lucide-react";
import { useAppSelector } from "src/store/store";
import {
  useRegisterTeacherMutation,
  useUpdateTeacherMutation,
} from "src/store/admin/teachers/teachers";
import type { Course } from "src/consts/types";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import type { AdminTeacher, BackendErrorResponse } from "src/consts/types";
import TextArea from "@components/Fields/TextAreaField";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  teacher?: AdminTeacher | null | undefined;
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

const AddTeacher: React.FC<Props> = ({ isOpen, onClose, teacher }) => {
  const [openDropdown, setOpenDropdown] = React.useState(false);
  const [openAccordion, setOpenAccordion] = React.useState<string | null>(null);
  const { courses, groups } = useAppSelector((state) => state.groupsCourses);
  const [registerTeacher, { isLoading }] =
    useRegisterTeacherMutation();
  const [updateTeacher] = useUpdateTeacherMutation();

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
      description:""
    },
  });
  React.useEffect(() => {
    if (teacher?.id) {
      reset({
        full_name: teacher?.full_name,
        email: teacher?.email,
        phone_number: teacher?.phone_number,
        role: teacher?.role,
        description:teacher?.description
      });
    } else {
      reset({
        full_name: "",
        email: "",
        phone_number: "",
        role: "teacher",
        description:""
        
      });
    }
  }, [teacher, reset]);
  const selectedCourse = watch("group");
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const selectedGroupId = !teacher
        ? groups?.find((g) => g.name === data.group)?.id ?? null
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
        alert("Преподаватель обновлён");
      } else {
        await registerTeacher({
          groupId: selectedGroupId,
          teacherData: payload,
        }).unwrap();
        alert(`Преподаватель ${data.full_name} успешно зарегистрирован`);
      }

      reset();
      onClose();
    } catch (err) {
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
        alert(
          typeof validationErrors === "string"
            ? validationErrors
            : "Ошибка валидации, попробуйте снова"
        );
      } else {
        console.error(err);
        alert("Ошибка, попробуйте позже");
      }
    }
  };

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
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.input_container}>
          <InputField
            {...register("full_name", {
              required: "Имя и фамилия обязательны",
              minLength: { value: 2, message: "Минимум 2 символа" },
            })}
            isShadow
            fullWidth
            // style={{ maxWidth: "45%" }}
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
            // style={{ width: "45%" }}
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
            // style={{ maxWidth: "45%" }}
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
        <div className={styles.dropdown}>
          {/* Dropdown trigger */}
          {!teacher?.id && (
            <button
              type="button"
              className={styles.dropdown__trigger}
              onClick={() => setOpenDropdown(!openDropdown)}
            >
              {selectedCourse
                ? selectedCourse // просто строка с названием группы
                : "Выберите группу"}
              <ChevronDown className={styles.dropdown__icon} />
            </button>
          )}

          {/* Dropdown content */}
          {openDropdown && (
            <div className={styles.dropdown__content}>
              {/* Сначала группируем курсы по языку */}
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
                  {/* Accordion header */}
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

                  {/* Accordion body */}
                  {openAccordion === language && (
                    <div style={{ paddingLeft: "10px", paddingBlock: "10px" }}>
                      <Controller
                        name="group"
                        control={control}
                        rules={{ required: "Нужно выбрать одну группу" }}
                        render={({ field }) => (
                          <div className={styles.dropdown__input_container}>
                            {groups
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
          <button className={styles.save__button} disabled={isLoading}>
            {" "}
            {isLoading
              ? "Сохраняем..."
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
