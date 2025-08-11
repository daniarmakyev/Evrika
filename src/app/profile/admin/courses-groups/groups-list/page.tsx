"use client";

import classNames from "classnames";
import styles from "./styles.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function GroupsList() {
  const pathname = usePathname();

  return (
    <div>
      <div className={classNames(styles.courses__container, "container")}>
        <div className={styles.courseGroupSwitch}>
          <Link
            href={"/profile/admin/courses-groups/courses-list"}
            className={classNames(styles.switchItem, {
              [styles.active]: pathname.endsWith("/courses-list"),
            })}
          >
            Курсы
          </Link>
          <Link
            href={"/profile/admin/courses-groups/groups-list"}
            className={classNames(styles.switchItem, {
              [styles.active]: pathname.endsWith("/groups-list"),
            })}
          >
            Группы
          </Link>
        </div>
      </div>
    </div>
  );
}
