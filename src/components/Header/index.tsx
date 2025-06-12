'use client';

import React from "react";
import Link from "next/link";
import PopupHeader from "@components/Ui/Popup";
import Logo from "@icons/logo.svg";
import Profile from "@icons/user-profile.svg";
import styles from "./styles.module.scss";

const menu = [
  {
    id: 1,
    name: "Главная",
    link: "/",
  },
  {
    id: 2,
    name: "Расписание",
    link: "#",
  },
  {
    id: 3,
    name: "О школе",
    link: "#",
  },
  {
    id: 4,
    name: "Цены",
    link: "#",
  },
  {
    id: 5,
    name: "Контакты",
    link: "#",
  },
];

const Header = ({}) => {
  const profileRef = React.useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      };
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.header__container}>
        <div className={styles.header__logo}>
          <Logo />
        </div>
        <div className={styles.header__menu}>
          <ul>
            {menu.map((item) => (
              <li key={item.id}>
                <Link href={item.link}>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div
          ref={profileRef}
          onClick={() => setIsOpen((prev) => !prev)}
          className={styles.header__profile}
        >
          <Profile />
          <PopupHeader isOpen={isOpen} />
        </div>
      </div>
    </header>
  )
};

export default Header;