"use client";
import React from "react";
import InputField from "@components/Fields/InputField";
import classNames from "classnames";
import styles from "./styles.module.scss";
import StudentGroups from "./_components/StudentGroups";
import { useParams } from "next/navigation";
import { useGetUserInfoQuery, useGetGroupListQuery } from "src/store/admin/students/students";


const StudentDetailPage = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { data, error, isLoading, refetch } = useGetUserInfoQuery({
    user_id: id,
  });
  const{data:groupList, error:groupListError,isLoading:groupListLoading}=useGetGroupListQuery()
  console.log(groupList)
  if (error) {
    return (
      <div className={styles.errorMessage}>
        <p>Произошла ошибка при загрузке личную информацию студента.</p>
        <pre>{JSON.stringify(error, null, 2)}</pre>
        <button onClick={() => refetch()} className={styles.retryButton}>
          Повторить попытку
        </button>
      </div>
    );
  }

  return (
    <div className={classNames(styles.personalInfoContainer, "container")}>
      <div className={styles.personalInfoWrapper}>
        <div className={styles.personalInfoHeader}>
          <h2>Личная информация</h2>
          <button className={styles.status}>Активен</button>
        </div>
        {isLoading ? (
          <PersonalInfoSkeleton />
        ) : (
          <div className={styles.form}>
            <InputField
              label="Имя и фамилия"
              placeholder={`${data?.first_name} ${data?.last_name} `}
              disabled
              fullWidth
              isShadow
              style={{ width: "45%" }}
            />

            <InputField
              label="Телефон"
              placeholder={data?.phone_number}
              disabled
              fullWidth
              isShadow
              style={{ width: "45%" }}
            />
            <div className={styles.innerForm}>
              <InputField
                label="Почта"
                type="email"
                placeholder={data?.email}
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
        )}
      </div>
      <StudentGroups />
    </div>
  );
};

export default StudentDetailPage;

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