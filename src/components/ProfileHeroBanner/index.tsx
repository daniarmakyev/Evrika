"use client";

import React, { memo } from "react";
import classNames from "classnames";
import styles from "./styles.module.scss";

interface ProfileHeroBannerProps {
  name: string;
  role?: string;
}

const ProfileHeroBanner: React.FC<ProfileHeroBannerProps> = ({
  name,
  role,
}) => {
  return (
    <section className={styles.quote}>
      <div className={classNames(styles.quote__container, "container")}>
        <div className={styles.quote__title}>
          <h1>
            {role === "teacher" || role === "admin" ? "Здравствуйте, учитель," : "Привет,"}
            <br />
            {name}
          </h1>
        </div>
      </div>
    </section>
  );
};

export default memo(ProfileHeroBanner);
