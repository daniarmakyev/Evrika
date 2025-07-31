import React from "react";
import Link from "next/link";
import classNames from "classnames";
import { UserType } from "src/consts/types";
import styles from "./styles.module.scss";

interface PopupHeaderProps {
  isOpen: boolean;
  user?: UserType | null;
  onLogout?: () => void;
  isAuthenticated?: boolean;
}

const PopupHeader: React.FC<PopupHeaderProps> = ({ 
  isOpen, 
  user, 
  onLogout, 
  isAuthenticated 
}) => {
  const menuItems = isAuthenticated && user ? [
    {
      id: 1,
      name: "Профиль",
      link: "/profile/personal-info",
    },
    {
      id: 3,
      name: "Расписание",
      link: "/profile/schedule",
    },
  ] : [
    {
      id: 4,
      name: "Войти",
      link: "/auth/login",
    },
  ];

  return (
    <div className={classNames(styles.popup, {
      [styles.header__popup_isOpen]: isOpen,
    })}>
      <ul>
        {menuItems.map((item) => (
          <li key={item.id}>
            <Link href={item.link}>
              {item.name}
            </Link>
          </li>
        ))}
        
        {isAuthenticated && onLogout && (
          <li>
            <a onClick={onLogout}>
              Выйти
            </a>
          </li>
        )}
      </ul>
    </div>
  );
};

export default PopupHeader;