'use client';

import styles from "./styles.module.scss";

const AsideButton = ({}) => {
  const scrollToSignup = () => {
    setTimeout(() => {
      const section = document.getElementById("signup");
      if (section) {
        const offset = section.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: offset, behavior: "smooth" });
      }
    }, 0);
  };

  return (
    <button className={styles.asideBtn} onClick={scrollToSignup}>
      <span>Записаться</span>
    </button>
  )
};

export default AsideButton;