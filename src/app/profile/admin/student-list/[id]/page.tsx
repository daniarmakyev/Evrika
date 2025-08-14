'use client'
import React from "react";
import InputField from "@components/Fields/InputField";
import classNames from "classnames";
import styles from "./styles.module.scss";
import StudentGroups from "./_components/StudentGroups";

const StudentDetailPage = () => {
  return (
    <div className={classNames(styles.personalInfoContainer, "container")}>
      <div className={styles.personalInfoWrapper}>
        <h2>Личная информация</h2>
        <div className={styles.form}>
          <InputField
            label="Имя и фамилия"
            placeholder="Айкокул Чаргынова"
            disabled
          />

          <InputField
            label="Телефон"
            placeholder="+7 (999) 999-99-99"
            disabled
          />
          <InputField
            label="Почта"
            type="email"
            placeholder="example@mail.com"
            disabled
          />
          <button className={styles.button}>Сбросить пароль</button>
        </div>
        <button className={styles.status}>Активен</button>
      </div>
      <StudentGroups/>
    </div>
  );
};

export default StudentDetailPage;
