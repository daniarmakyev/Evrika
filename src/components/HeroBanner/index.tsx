'use client';

import React from "react";
import Image from "next/image";
import classNames from "classnames";
import styles from "./styles.module.scss";

interface HeroBannerData {
  title: string;
  description: string;
  image: {
    url: string;
    name: string;
  };
}

interface HeroBannerProps {
  data: HeroBannerData;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ data }) => {
  const scrollToSignup = () => {
    const section = document.getElementById("signup");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className={styles.quote}>
      <div className={classNames(styles.quote__container, "container")}>
        <div className={styles.quote__info}>
          <div className={styles.quote__title}>
            <h1>{data.title}</h1>
          </div>
          <div className={styles.quote__description}>
            <p>{data.description}</p>
          </div>
          <div className={styles.quote__btn}>
            <button onClick={scrollToSignup}>
              <span>Записаться</span>
            </button>
          </div>
        </div>
        <div className={styles.quote__image}>
          <Image
            src={data.image.url}
            alt={data.image.name}
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

export default HeroBanner;