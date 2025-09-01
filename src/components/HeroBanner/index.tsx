"use client";

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
  button?: boolean;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ data, button = true }) => {
  // const scrollToSignup = () => {
  //   setTimeout(() => {
  //     const section = document.getElementById("signup");
  //     if (section) {
  //       const offset =
  //         section.getBoundingClientRect().top + window.scrollY - 100;
  //       window.scrollTo({ top: offset, behavior: "smooth" });
  //     }
  //   }, 0);
  // };

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
          {button && (
            <div className={styles.quote__btn}>
              <button
                onClick={() =>
                  window.open("https://wa.me/996555123456", "_blank")
                }
              >
                Записаться
              </button>
            </div>
          )}
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
  );
};

export default HeroBanner;
