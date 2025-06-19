'use client';

import React from "react";
import Image from "next/image";
import classNames from "classnames";
import SectionInfo from "@components/SectionInfo";
import styles from "./styles.module.scss";

interface InstructorsData {
  name: string;
  position: string;
  description: string;
  image: {
    url: string;
    name: string;
  };
}

interface InstructorsProps {
  data: InstructorsData[];
}

const InstructorsSection: React.FC<InstructorsProps> = ({ data }) => {
  return (
    <section className={classNames(styles.instructors, "container")}>
      <div className={styles.instructors__container}>
        <SectionInfo
          title="Преподаватели"
          description="Все наши преподаватели когда-то закончили курсы нашей школы, а старшие преподаватели работают в международных компаниях или преподают за рубежом."
        />
        <div className={styles.instructors__cards}>
          {data.map((item, index) => (
            <div key={index} className={styles.instructors__wrapper}>
              <div className={styles.instructors__image}>
                <Image
                  quality={100}
                  width={300}
                  height={300}
                  src={item.image.url}
                  alt={item.image.name}
                />
                <div className={styles.instructors__info}>
                  <h4>{item.name}</h4>
                  <p>{item.position}</p>
                  <p>{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
};

export default InstructorsSection;