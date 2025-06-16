'use client';

import React from "react";
import styles from "./styles.module.scss";
import Image from "next/image";

const QuoteSection = ({}) => {
  const scrollToSignup = () => {
    const section = document.getElementById("signup");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className={styles.quote}>
      <div className={styles.quote__container}>
        <div className={styles.quote__info}>
          <div className={styles.quote__title}>
            <h1>От первых слов - к свободной речи</h1>
          </div>
          <div className={styles.quote__description}>
            <p>Запишись на пробный урок - шаг к свободному общению!</p>
          </div>
          <div className={styles.quote__btn}>
            <button onClick={scrollToSignup}>
              <span>Записаться</span>
            </button>
          </div>
        </div>
        <div className={styles.quote__image}>
          <Image
            src="/assets/images/quote.png"
            alt="image quote"
            width={600}
            height={600}
            priority
            quality={100}
          />
        </div>
      </div>
    </section>
  )
};

export default QuoteSection;