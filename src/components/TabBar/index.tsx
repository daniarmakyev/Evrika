import React from "react";
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./styles.module.scss";

interface TabItem {
  tab: string;
  icon?: React.ReactNode;
  link?: string;
  isUnderline?: boolean;
}

interface TabBarProps {
  items: TabItem[];
}

const TabBar: React.FC<TabBarProps> = ({ items }) => {
  const pathname = usePathname();

  return (
    <nav className={styles.tabBar}>
      {items.map((item) => {
        const isActive = "/profile" + item.link === pathname;
        return item.link ? (
          <Link
            key={item.tab}
            href={`/profile/${item.link}`}
            className={classNames(styles.tab, {
              [styles.tab_active]: isActive,
            })}
          >
            {item.icon && <span className={styles.tab__icon}>{item.icon}</span>}
            <span className={styles.tab__text}>{item.tab}</span>
            {item.isUnderline && (
              <span
                className={classNames(styles.tab__underline, {
                  [styles.tab__underline_active]: isActive,
                })}
              />
            )}
          </Link>
        ) : (
          <button key={item.tab} type="button" className={styles.tab}>
            {item.icon && <span className={styles.tab__icon}>{item.icon}</span>}
            <span className={styles.tab__text}>{item.tab}</span>
            {item.isUnderline && <span className={styles.tab__underline} />}
          </button>
        );
      })}
    </nav>
  );
};

export default TabBar;
