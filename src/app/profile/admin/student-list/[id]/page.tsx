"use client";
import React from "react";
import InputField from "@components/Fields/InputField";
import classNames from "classnames";
import styles from "./styles.module.scss";
import StudentGroups from "./_components/StudentGroups";

const StudentDetailPage = () => {
  return (
    <div className={classNames(styles.personalInfoContainer, "container")}>
      <div className={styles.personalInfoWrapper}>
        <div className={styles.personalInfoHeader}>
          <h2>Личная информация</h2>
          <button className={styles.status}>Активен</button>
        </div>
        <div className={styles.form}>
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
            <div className={styles.button_container}>
              <button className={styles.button}>Сбросить пароль</button>
            </div>
          </div>
        </div>
      </div>
      <StudentGroups />
    </div>
  );
};

export default StudentDetailPage;
