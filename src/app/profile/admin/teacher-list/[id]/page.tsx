"use client";
import React from "react";
import InputField from "@components/Fields/InputField";
import TableSkeleton from "@components/TableSkeleton/TableSkeleton";
import classNames from "classnames";
import styles from "./styles.module.scss";
import { useRouter, useParams } from "next/navigation";
import { useGetTeacherInfoQuery } from "src/store/admin/teachers/teachers";


const TeacherDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const user_id = Array.isArray(params.id) ? params.id[0] : params.id;

  const {
    data: teacherData,
    error,
    isLoading,
    refetch,
  } = useGetTeacherInfoQuery(
    {
      user_id,
    },
    {
      skip: !user_id,
    }
  );

  console.log(teacherData)

  const handleClick = () => {
    router.push(
      `/profile/admin/teacher-list/${teacherData?.id}/${teacherData?.id}`
    );
  };

  if (isLoading) return <TableSkeleton />;
  if (error) {
    return (
      <div className={styles.errorMessage}>
        <p>Произошла ошибка при загрузке студентов.</p>
        <pre>{JSON.stringify(error, null, 2)}</pre>
        <button onClick={() => refetch()} className={styles.retryButton}>
          Повторить попытку
        </button>
      </div>
    );
  }

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
          <button className={styles.status}>
            {teacherData?.is_active ? "Aктивен" : "Не активен"}
          </button>
        </div>
        <div className={styles.form}>
          <div className={styles.innerForm}>
            <InputField
              label="Имя и фамилия"
              placeholder={teacherData?.full_name}
              disabled
              fullWidth
              isShadow
              style={{ width: "45%" }}
            />

            <InputField
              label="Телефон"
              placeholder={teacherData?.phone_number}
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
              placeholder={teacherData?.email}
              disabled
              fullWidth
              isShadow
              style={{ width: "45%" }}
            />
            <InputField
              label="Курс преподавания"
              type="text"
              placeholder={teacherData?.groups?.map(group => group.name).join(", ") || ""}
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
