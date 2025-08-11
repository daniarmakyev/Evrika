"use client";

import React, { memo } from "react";
import classNames from "classnames";
import styles from "./styles.module.scss";

interface ProfileHeroBannerProps {
  name: string;
  role?: string;
}

const ProfileHeroBanner: React.FC<ProfileHeroBannerProps> = ({ name, role }) => {
  const greeting =
    role === "teacher"
      ? "Здравствуйте, учитель"
      : role === "admin"
      ? "Здравствуйте, администратор"
      : "Привет";

  return (
    <section className={styles.quote}>
      <div className={classNames(styles.quote__container, "container")}>
        <div className={styles.quote__title}>
          <h1>
            {greeting}
            <br />
            {name}
          </h1>
        </div>
      </div>
    </section>
  );
};

export default memo(ProfileHeroBanner);
