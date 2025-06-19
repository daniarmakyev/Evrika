import classNames from "classnames";
import styles from "./styles.module.scss";

const StartCoursesSection = ({ title, description }: { title: string, description: string }) => {
  return (
    <section className={classNames(styles.start, "container")}>
      <div className={styles.start__title}>
        <span>{title}</span>
      </div>
      <div className={styles.start__description}>
        <h4>{description}</h4>
      </div>
    </section>
  );
};

export default StartCoursesSection;