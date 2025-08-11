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
  matchPattern?: string;
}

interface TabBarProps {
  items: TabItem[];
}

const TabBar: React.FC<TabBarProps> = ({ items }) => {
  const pathname = usePathname();

  return (
    <nav className={styles.tabBar}>
      {items.map((item) => {
        if (!item.link) {
          return (
            <button key={item.tab} type="button" className={styles.tab}>
              {item.icon && (
                <span className={styles.tab__icon}>{item.icon}</span>
              )}
              <span className={styles.tab__text}>{item.tab}</span>
              {item.isUnderline && <span className={styles.tab__underline} />}
            </button>
          );
        }

        const fullLink = `/profile/${
          item.link.startsWith("/") ? item.link.slice(1) : item.link
        }`;

        const isActive = item.matchPattern
          ? pathname.startsWith(
              `/profile/${
                item.matchPattern.startsWith("/")
                  ? item.matchPattern.slice(1)
                  : item.matchPattern
              }`
            )
          : pathname === fullLink || pathname.startsWith(fullLink + "/");

        return (
          <Link
            key={item.tab}
            href={fullLink}
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
        );
      })}
    </nav>
  );
};

export default TabBar;
