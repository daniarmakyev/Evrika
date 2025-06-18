import React from "react";
import Link from "next/link";
import styles from "./styles.module.scss";

interface Inormation {
  title: string;
  description: string;
  all_see?: string;
  link?: string;
}

const InfoSection: React.FC<Inormation> = ({title, description, all_see, link}) => {
  return (
    <div className={styles.info}>
      <div className={styles.info__title}>
        <h3>{title}</h3>
      </div>
      <div className={styles.info__details}>
        <div className={styles.info__description}>
          <p>{description}</p>
        </div>
        {all_see && link && (
          <div className={styles.info__allSee}>
            <Link href={link}>
              {all_see}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoSection;