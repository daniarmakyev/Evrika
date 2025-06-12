import React from "react";
import Link from "next/link";
import classNames from "classnames";
import styles from "./styles.module.scss";

interface PopupHeaderProps {
  isOpen: boolean;
}

const profile = [
  {
    id: 1,
    name: "Профиль",
    link: "/",
  },
  {
    id: 2,
    name: "Оценки",
    link: "#"
  },
  {
    id: 3,
    name: "Расписание",
    link: "#"
  },
  {
    id: 4,
    name: "Выход",
    link: "#",
  },
];

const PopupHeader: React.FC<PopupHeaderProps> = ({isOpen}) => {
  return (
    <div className={classNames(styles.popup, {
      [styles.header__popup_isOpen]: isOpen,
    })}>
      <ul>
        {profile.map((item) => (
          <li key={item.id}>
            <Link href={item.link}>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
};

export default PopupHeader;