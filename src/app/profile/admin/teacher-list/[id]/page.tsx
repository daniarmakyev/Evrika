"use client";
import React from "react";
import InputField from "@components/Fields/InputField";
import classNames from "classnames";
import styles from "./styles.module.scss";
import { useRouter } from "next/navigation";

const TeacherDetailPage = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/profile/admin/teacher-list/1/1"); // navigate to /target-page
  };

  return (
    <div className={classNames(styles.personalInfoContainer, "container")}>
      <div className={styles.button_container}>
        <button className={styles.add__button} onClick={handleClick}>
          Расписание
        </button>
      </div>
      <div className={styles.personalInfoWrapper}>
        <div className={styles.personalInfoHeader}>
          <h2>Личная информация</h2>
          <button className={styles.status}>Активен</button>
        </div>
        <div className={styles.form}>
          <div className={styles.innerForm}>
            <InputField
              label="Имя и фамилия"
              placeholder="Айкокул Чаргынова"
              disabled
              fullWidth
              isShadow
              style={{ width: "45%" }}
            />

            <InputField
              label="Телефон"
              placeholder="+7 (999) 999-99-99"
              disabled
              fullWidth
              isShadow
              style={{ width: "45%" }}
            />
          </div>
          <div className={styles.innerForm}>
            <InputField
              label="Почта"
              type="email"
              placeholder="example@mail.com"
              disabled
              fullWidth
              isShadow
              style={{ width: "45%" }}
            />
            <InputField
              label="Курс преподавания"
              type="text"
              placeholder="Английский A1"
              disabled
              fullWidth
              isShadow
              style={{ width: "45%" }}
            />
          </div>
        </div>

        <button className={styles.button}>Сбросить пароль</button>
      </div>
    </div>
  );
};

export default TeacherDetailPage;
