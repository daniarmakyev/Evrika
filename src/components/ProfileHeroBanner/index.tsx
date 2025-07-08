"use client";

import React from "react";
import classNames from "classnames";
import styles from "./styles.module.scss";

interface ProfileHeroBannerProps {
  name: string;
}

const ProfileHeroBanner: React.FC<ProfileHeroBannerProps> = ({ name }) => {
  return (
    <section className={styles.quote}>
      <div className={classNames(styles.quote__container, "container")}>
        <div className={styles.quote__title}>
          <h1>
            Привет,
            <br />
            {name}
          </h1>
        </div>
      </div>
    </section>
  );
};

export default ProfileHeroBanner;
