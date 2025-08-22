import ProfileModal from "@components/ProfileModal";
import InputField from "@components/Fields/InputField";
import React from "react";
import styles from "./styles.module.scss";
import { ChevronDown } from "lucide-react";
import { useAppSelector } from "src/store/store";
import { useRegisterStudentMutation } from "src/store/admin/students/students";
import type { Course } from "src/consts/types";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

interface FormData {
  group: string[];
  phone_number: string;
  email: string;
  full_name: string;
  role: string;
}
type PostForm = {
  phone_number: string;
  email: string;
  full_name: string;
  role: string;
};
// type ValidationError = {
//   type: string;
//   loc: string | string[];
//   msg: string;
//   input?: unknown;
// };
type CoursesByLanguage = Record<string, Course[]>;
const AddStudent: React.FC<Props> = ({ isOpen, onClose }) => {
  const [openDropdown, setOpenDropdown] = React.useState(false);
  const [openAccordion, setOpenAccordion] = React.useState<string | null>(null);
  const { courses, groups } = useAppSelector((state) => state.groupsCourses);
  const [registerStudent, { isLoading, isSuccess }] =
    useRegisterStudentMutation();

  const {
    control,
    reset,
    watch,
    register,
    // setError,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>({
    defaultValues: {
      full_name: "",
      group: [],
      phone_number: "",
      email: "",
      role: "student",
    },
  });
  const selectedCourse = watch("group");
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const selectedGroupIds =
        groups?.filter((g) => data.group.includes(g.name)).map((g) => g.id) ??
        [];

      if (selectedGroupIds.length === 0) {
        alert("Нужно выбрать хотя бы одну группу");
        return;
      }

      const payload: PostForm = {
        full_name: data.full_name,
        email: data.email,
        phone_number: data.phone_number,
        role: data.role,
      };

      await registerStudent({
        groupIds: selectedGroupIds,
        studentData: payload,
      }).unwrap();

      alert(`Студент ${data.full_name} успешно зарегистрирован`);
      reset();
      onClose();
    } catch (err) {
      const error = err as FetchBaseQueryError 
      if ("status" in error && error.status === "FETCH_ERROR") {
        console.warn("Запрос прошел, но ответ не обработан:", error);
        // Можно не показывать alert, если знаете, что сервер добавил студента
      } else {
        alert("Не удалось зарегистрировать студента. Попробуйте позже.");
      }
    }
  };

  return (
    <ProfileModal
      isOpen={isOpen}
      onClose={onClose}
      title="Добавление студента"
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
                value: /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/,
                message: "Введите телефон в формате +7 (999) 999-99-99",
              },
            })}
            isShadow
            fullWidth
            // style={{ width: "45%" }}
            label="Телефон"
            placeholder="+7 (999) 999-99-99"
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
          <button
            type="button"
            className={styles.dropdown__trigger}
            onClick={() => setOpenDropdown(!openDropdown)}
          >
            {selectedCourse && selectedCourse.length > 0
              ? selectedCourse.length === 1
                ? selectedCourse
                : selectedCourse.length >= 2 && selectedCourse.length <= 4
                ? `Выбрано ${selectedCourse.length} группы`
                : `Выбрано ${selectedCourse.length} групп`
              : "Выберите группы"}
            <ChevronDown className={styles.dropdown__icon} />
          </button>

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
                        control={control}
                        rules={{
                          validate: (value) =>
                            value.length > 0 ||
                            "Нужно выбрать хотя бы одну группу",
                        }}
                        name="group"
                        render={({ field }) => (
                          <div className={styles.dropdown__input_container}>
                            {groups
                              ?.filter((group) =>
                                languageCourses.some(
                                  (course: Course) =>
                                    course.id === group.course_id
                                )
                              )
                              .map((group) => (
                                <label
                                  key={group.id}
                                  className={
                                    styles.dropdown__input_container_label
                                  }
                                >
                                  <div>
                                    <input
                                      className={styles.dropdown__checkbox}
                                      type="checkbox"
                                      value={group.name}
                                      checked={field.value.includes(group.name)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          field.onChange([
                                            ...field.value,
                                            group.name,
                                          ]);
                                        } else {
                                          field.onChange(
                                            field.value.filter(
                                              (val) => val !== group.name
                                            )
                                          );
                                        }
                                      }}
                                    />
                                  </div>
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
            {isLoading ? "Сохраняем..." : "Добавить"}
          </button>
        </div>
        {isSuccess && <p style={{ color: "green" }}>Успешная регистрация!</p>}
      </form>
    </ProfileModal>
  );
};

export default AddStudent;
