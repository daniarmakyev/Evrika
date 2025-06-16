'use client';

import React from "react";
import styles from "./styles.module.scss";

const AsideButton = ({}) => {
  const scrollToSignup = () => {
    const section = document.getElementById("signup");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <button className={styles.asideBtn} onClick={scrollToSignup}>
      <span>Записаться</span>
    </button>
  )
};

export default AsideButton;