import React from "react";
import classNames from "classnames";
import styles from "./styles.module.scss";

interface PopupHeaderProps {
  isOpen: boolean;
}

const profile = [
  {
    id: 1,
    name: "Профиль",
  },
  {
    id: 2,
    name: "Оценки",
  },
  {
    id: 3,
    name: "Расписание",
  },
  {
    id: 4,
    name: "Выход",
  },
];

const PopupHeader: React.FC<PopupHeaderProps> = ({isOpen}) => {
  return (
    <div className={classNames(styles.popup, {
      [styles.header__popup_isOpen]: isOpen,
    })}>
      <ul>
        {profile.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  )
};

export default PopupHeader;