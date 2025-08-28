"use client";

import TabBar from "@components/TabBar";
import UserIcon from "public/assets/icons/user-outline.svg";
import CalendarIcon from "public/assets/icons/calendar-outline.svg";
import HomeIcon from "public/assets/icons/home-outline.svg";
import GroupsIcon from "public/assets/icons/groups-outline.svg";
import DollatIcon from "public/assets/icons/dollarIcon.svg";
import GroupsAdminIcon from "public/assets/icons/groupsAdminIcon.svg";

import styles from "./styles.module.scss";
import classNames from "classnames";

const studentData = [
  { tab: "Личная информация", icon: <UserIcon />, link: "/personal-info" },
  { tab: "Расписание", icon: <CalendarIcon />, link: "/schedule" },
  { tab: "Домашнее задание", icon: <HomeIcon />, link: "/homework" },
  { tab: "Чеки", icon: <GroupsAdminIcon />, link: "/checks" },
  { tab: "Платежи", icon: <DollatIcon />, link: "/studentPayments" },
];

const teacherData = [
  { tab: "Личная информация", icon: <UserIcon />, link: "/personal-info" },
  { tab: "Расписание", icon: <CalendarIcon />, link: "/schedule" },
  { tab: "Группы", icon: <GroupsIcon />, link: "/groups" },
  { tab: "Домашнее задание", icon: <HomeIcon />, link: "/homework/teacher" },
];

const adminData = [
  { tab: "Преподаватели", icon: <UserIcon />, link: "/admin/teacher-list" },
  { tab: "Студенты", icon: <UserIcon />, link: "/admin/student-list" },
  {
    tab: "Курсы и группы",
    icon: <GroupsAdminIcon />,
    link: "/admin/courses-groups/courses-list",
    matchPattern: "/admin/courses-groups",
  },
  { tab: "Платежи", icon: <DollatIcon />, link: "/admin/payments-list" },
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

  const getTabs = () => {
    if (isProfileStudent) {
      if (role === "teacher" || role === "admin") return studentProfileWithId;
      return studentData.map((tab) => ({ ...tab, isUnderline: true }));
    }

    if (role === "teacher") return teacherData;
    if (role === "admin") return adminData;
    return studentData.map((tab) => ({ ...tab, isUnderline: true }));
  };

  return (
    <div className={styles.tabBarWrapper}>
      <div className={classNames(styles.tabBarContainer, "container")}>
        <TabBar items={getTabs()} />
      </div>
    </div>
  );
}
