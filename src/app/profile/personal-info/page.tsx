"use client";
import styles from "./styles.module.scss";
import InputField from "@components/Fields/InputField";
import classNames from "classnames";
import { memo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "src/store/store";
import { getUser } from "src/store/user/user.action";

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

const PersonalInfo: React.FC = () => {
  const { control } = useForm<FormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      courses: "",
      phone: "",
      email: "",
    },
  });

  const { user, loading, error } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(getUser());
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
        {loading || !user ? (
          <PersonalInfoSkeleton />
        ) : (
          <form>
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => (
                <InputField
                  {...field}
                  value={`${user.first_name} ${user.last_name}`}
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
                  value={user.courses.map((course) => course.name).join(", ")}
                  label={
                    user.role === "admin" || user.role === "teacher"
                      ? "Курсы преподавания"
                      : "Курсы"
                  }
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
                  value={user.phone_number || ""}
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
                  value={user.email}
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
};

export default memo(PersonalInfo);
