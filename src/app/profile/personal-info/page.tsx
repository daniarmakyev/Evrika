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

  const { student } = useAppSelector((state) => state.student);
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

  return (
    <div className={classNames(styles.personalInfoContainer, "container")}>
      <div className={styles.personalInfoWrapper}>
        <h2>Личная информация</h2>
        {student && (
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

            {/* <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <InputField
                    {...field}
                    label="Адрес"
                    placeholder="Введите ваш адрес"
                    disabled
                  />
                )}
              /> */}
          </form>
        )}
        {/* <div className={styles.buttonContainer}>
          <button>
            <span>Изменить</span>
          </button>
        </div> */}
      </div>
    </div>
  );
}
