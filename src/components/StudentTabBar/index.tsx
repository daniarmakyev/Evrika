"use client";

import TabBar from "@components/TabBar";
import UserIcon from "public/assets/icons/user-outline.svg";
import CalendarIcon from "public/assets/icons/calendar-outline.svg";
import HomeIcon from "public/assets/icons/home-outline.svg";
import GroupsIcon from "public/assets/icons/groups-outline.svg";
import styles from "./styles.module.scss";
import classNames from "classnames";

const studentData = [
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
  // {
  //   tab: "Уроки",
  //   icon: <LessonIcon />,
  //   link: "/lessons",
  // },
  // {
  //   tab: "Статус оплаты",
  //   icon: <DollarIcon />,
  //   link: "/payment-status",
  // },
  // {
  //   tab: "Чеки",
  //   icon: <CheksIcon />,
  //   link: "/cheques",
  // },
];

const teacherData = [
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
    tab: "Группы",
    icon: <GroupsIcon />,
    link: "/groups",
  },
  {
    tab: "Домашнее задание",
    icon: <HomeIcon />,
    link: "/homework/teacher",
  },
];

export default function StudentTabBar({
  role,
  isProfileStudent,
  studentId,
}: {
  role: string | null;
  isProfileStudent?: boolean;
  studentId?: string | number | null;
}) {
  if (!role) return null; 

  const studentProfileWithId = studentId
    ? [
        {
          tab: "Домашнее задание",
          icon: <HomeIcon />,
          link: `/homework/${studentId}`,
        },
        {
          tab: "Посещаемость",
          icon: <UserIcon />,
          link: `/attendance/${studentId}`,
        },
      ]
    : [];

  return (
    <div className={styles.tabBarWrapper}>
      <div className={classNames(styles.tabBarContainer, "container")}>
        {isProfileStudent ? (
          <TabBar
            items={
              role === "teacher" || role === "admin"
                ? studentProfileWithId
                : studentData.map((tab) => ({
                    ...tab,
                    isUnderline: true,
                  }))
            }
          />
        ) : (
          <TabBar
            items={
              role === "teacher" || role === "admin"
                ? teacherData
                : studentData.map((tab) => ({
                    ...tab,
                    isUnderline: true,
                  }))
            }
          />
        )}
      </div>
    </div>
  );
}

