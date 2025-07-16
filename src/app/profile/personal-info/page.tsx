"use client";
import styles from "./styles.module.scss";
import InputField from "@components/Fields/InputField";
import classNames from "classnames";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "src/store/store";
import { getStudent } from "src/store/users/student/student.action";

interface FormData {
  firstName?: string;
  lastName?: string;
  courses: string;
  phone: string;
  email: string;
  fullName?: string;
}

const InputSkeleton = () => (
  <div className={styles.inputSkeleton}>
    <div className={styles.skeletonLabel}></div>
    <div className={styles.skeletonInput}></div>
  </div>
);

const PersonalInfoSkeleton = () => (
  <form>
    <InputSkeleton />
    <InputSkeleton />
    <InputSkeleton />
    <InputSkeleton />
  </form>
);

export default function PersonalInfo() {
  const { control } = useForm<FormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      courses: "",
      phone: "",
      email: "",
    },
  });

  const { student, loading, error } = useAppSelector((state) => state.student);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getStudent());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("evrika-access-token");

    if (!token) {
      localStorage.setItem(
        "evrika-access-token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiYXVkIjpbImZhc3RhcGktdXNlcnM6YXV0aCJdLCJleHAiOjE3NTMyNDgxNTJ9.0RETBdyxQq1Yl7kOzTcC_ex1tEDffKrwd4sageUrytM"
      );
    }
  }, []);

  const handleRetry = () => {
    dispatch(getStudent());
  };

  if (error) {
    return (
      <div className={classNames(styles.personalInfoContainer, "container")}>
        <div className={styles.personalInfoWrapper}>
          <div className={styles.errorContainer}>
            <div className={styles.errorIcon}>⚠️</div>
            <h3 className={styles.errorTitle}>Ошибка загрузки</h3>
            <p className={styles.errorMessage}>{error}</p>
            <button className={styles.retryButton} onClick={handleRetry}>
              <span>Попробовать снова</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={classNames(styles.personalInfoContainer, "container")}>
      <div className={styles.personalInfoWrapper}>
        <h2>Личная информация</h2>
        {loading || !student ? (
          <PersonalInfoSkeleton />
        ) : (
          <form>
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => (
                <InputField
                  {...field}
                  value={`${student.first_name} ${student.last_name}`}
                  label="Имя и фамилия"
                  placeholder="Введите имя и фамилию"
                  disabled
                />
              )}
            />

            <Controller
              name="courses"
              control={control}
              render={({ field }) => (
                <InputField
                  {...field}
                  value={student.courses
                    .map((course) => course.name)
                    .join(", ")}
                  label="Курсы"
                  placeholder="Введите курсы"
                  disabled
                />
              )}
            />

            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <InputField
                  {...field}
                  value={student.phone_number || ""}
                  label="Телефон"
                  placeholder="+7 (999) 999-99-99"
                  disabled
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <InputField
                  {...field}
                  value={student.email}
                  label="Почта"
                  type="email"
                  placeholder="example@mail.com"
                  disabled
                />
              )}
            />
          </form>
        )}
      </div>
    </div>
  );
}
