import React from "react";
import classNames from "classnames";
import Link from "next/link";
import styles from "./styles.module.scss";

interface Inormation {
  title: string;
  description?: string;
  all_see?: string;
  link?: string;
  isPagination?: boolean;
}

const SectionInfo: React.FC<Inormation> = ({title, description, all_see, link, isPagination}) => {
  return (
    <div className={classNames(styles.info, {
      [styles.info_isPagination]: isPagination,
    })}>
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

export default SectionInfo;