import classNames from "classnames";
import SectionInfo from "@components/SectionInfo";
import Logo from "@icons/logo-blue.svg"
import style from "./styles.module.scss";

const info = [
  {
    title: "Начинающим с нуля",
    description: "Если вы никогда не учили английский или забыли всё со школы - этот курс поможет начать с самого простого. Пошаговое обучение, понятные объяснения и поддержка преподавателей.",
  },
  {
    title: "Для учёбы и работы",
    description: "Если вы планируете учиться или работать за границей, курс поможет подтянуть грамматику, пополнить словарный запас и уверенно чувствовать себя в деловой или академической среде.",
  },
  {
    icon: <Logo />,
    description: "Курс английского языка для тех, кто хочет уверенно понимать речь, свободно говорить и использовать язык в повседневных ситуациях, путешествиях, учёбе или профессиональной сфере. Занятия подойдут как начинающим, так и тем, кто уже имеет базу и хочет улучшить свои навыки.",
  },
];

const SuitableCoursesSection = ({}) => {
  return (
    <section className={classNames(style.suitable, "container")}>
      <div className={style.suitable__container}>
        <SectionInfo title="Кому подойдёт этот курс?" />
        <div className={style.suitable__infoBlock}>
          {info.map((item, index) => (
            <div key={index} className={style.suitable__wrapper}>
              {item.title && (
                <div className={style.suitable__title}>
                  <h4>{item.title}</h4>
                </div>
              )}
              <div className={style.suitable__description}>
                {item.icon && (
                  <div className={style.suitable__logo}>
                    {item.icon}
                  </div>
                )}
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
};

export default SuitableCoursesSection;