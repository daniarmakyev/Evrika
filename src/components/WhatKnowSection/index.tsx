import classNames from "classnames";
import SectionInfo from "@components/SectionInfo";
import styles from "./styles.module.scss";

const cards = [
  {
    title: "Больше возможностей",
    description: "Английский открывает двери к обучению за границей, карьерному росту и доступу к лучшим мировым источникам знаний. Это инвестиция в ваше будущее, которая окупается многократно.",
  },
  {
    title: "Путешествия без преград",
    description: "Знание английского делает путешествия проще: вы легко ориентируетесь в аэропортах, отелях, на улицах и сможете свободно общаться с людьми по всему миру, не полагаясь на переводчиков и жесты.",
  },
  {
    title: "Общение без границ",
    description: "Зная английский, вы можете заводить друзей по всему миру, участвовать в международных сообществах, переписываться в соцсетях и обмениваться опытом с людьми из разных стран без языковых барьеров.",
  },
];

const WhatKnowSection = ({}) => {
  return (
    <section className={classNames(styles.know, "container")}>
      <div className={styles.know__container}>
        <SectionInfo title="Что даёт знание английского языка:" />
        <div className={styles.know__cards}>
          {cards.map((card, index) => (
            <div key={index} className={styles.know__wrapper}>
              <div className={styles.know__title}>
                <h4>{card.title}</h4>
              </div>
              <div className={styles.know__description}>
                <p>{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
};

export default WhatKnowSection;