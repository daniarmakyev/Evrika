"use client";

import React, { memo } from "react";
import classNames from "classnames";
import styles from "./styles.module.scss";

interface ProfileHeroBannerProps {
  name: string;
  role?: string;
  isStudentProfile?: boolean;
}

const ProfileHeroBanner: React.FC<ProfileHeroBannerProps> = ({
  name,
  role,
  isStudentProfile = false,
}) => {
  return (
    <section className={styles.quote}>
      <div className={classNames(styles.quote__container, "container")}>
        <div className={styles.quote__title}>
          {isStudentProfile ? (
            <h1 className={styles.quote__name}>Профиль студента: {name}</h1>
          ) : (
            <h1 className={styles.quote__name}>
              {name}{" "}
              {role && (
                <span className={styles.quote__role}>
                  {role === "teacher" ? "Преподаватель" : "Студент"}
                </span>
              )}
            </h1>
          )}
        </div>
      </div>
    </section>
  );
};

export default memo(ProfileHeroBanner);
