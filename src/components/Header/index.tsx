'use client';

import React from "react";
import Link from "next/link";
import classNames from "classnames";
// import PopupHeader from "@components/Ui/Popup";
import Logo from "@icons/logo.svg";
// import Profile from "@icons/user-profile.svg";
import styles from "./styles.module.scss";

const menu = [
  {
    id: 1,
    name: "Главная",
    link: "/",
  },
  {
    id: 2,
    name: "Курсы",
    link: "#",
  },
  {
    id: 3,
    name: "Контакты",
    link: "/contacts",
  },
];

const Header = ({}) => {
  // const profileRef = React.useRef<HTMLDivElement>(null);
  // const [isOpen, setIsOpen] = React.useState(false);

  // React.useEffect(() => {
  //   const handleClickOutside = (e: MouseEvent) => {
  //     if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
  //       setIsOpen(false);
  //     };
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   }
  // }, []);

  return (
    <header className={classNames(styles.header, "container")}>
      <div className={styles.header__container}>
        <div className={styles.header__logo}>
          <Link href="/">
            <Logo />
          </Link>
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
        {/* <div
          ref={profileRef}
          onClick={() => setIsOpen((prev) => !prev)}
          className={styles.header__profile}
        >
          <Profile />
          <PopupHeader isOpen={isOpen} />
        </div> */}
        <div className={styles.header__login}>
          <Link href="/auth/login">Войти</Link>
        </div>
      </div>
    </header>
  )
};

export default Header;