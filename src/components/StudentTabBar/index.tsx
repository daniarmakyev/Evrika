"use client";

import TabBar from "@components/TabBar";
import UserIcon from "public/assets/icons/user-outline.svg";
import CalendarIcon from "public/assets/icons/calendar-outline.svg";
import HomeIcon from "public/assets/icons/home-outline.svg";
import LessonIcon from "public/assets/icons/lesson-outline.svg";
import DollarIcon from "public/assets/icons/dollar-outline.svg";
import CheksIcon from "public/assets/icons/cheks-outline.svg";
import styles from "./styles.module.scss";
import classNames from "classnames";

const tabData = [
  {
    tab: "Личная информация",
    icon: <UserIcon />,
    link: "/personal-info",
  },
  {
    tab: "Расписание",
    icon: <CalendarIcon />,
    link: "/schedule",
  },
  {
    tab: "Домашнее задание",
    icon: <HomeIcon />,
    link: "/homework",
  },
  {
    tab: "Уроки",
    icon: <LessonIcon />,
    link: "/lessons",
  },
  {
    tab: "Статус оплаты",
    icon: <DollarIcon />,
    link: "/payment-status",
  },
  {
    tab: "Чеки",
    icon: <CheksIcon />,
    link: "/cheques",
  },
];

export default function StudentTabBar() {
  return (
    <div className={styles.tabBarWrapper}>
      <div className={classNames(styles.tabBarContainer, "container")}>
        <TabBar
          items={tabData.map((tab) => ({
            ...tab,
            isUnderline: true,
          }))}
        />
      </div>
    </div>
  );
}
