"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import classNames from "classnames";
import PopupHeader from "@components/Ui/Popup";
import Logo from "@icons/logo.svg";
import Profile from "@icons/user-profile.svg";
import styles from "./styles.module.scss";
import { initializeAuth, logout } from "src/store/user/user.slice";
import { getUser } from "src/store/user/user.action";
import { useAppDispatch, useAppSelector } from "src/store/store";

const menu = [
  { id: 1, name: "Главная", link: "/" },
  { id: 2, name: "Курсы", link: "/courses" },
  { id: 3, name: "Контакты", link: "/contacts" },
  { id: 4, name: "Расписание", link: "/schedule" },
];

const Header = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated, user, loading } = useAppSelector(
    (state) => state.user
  );

  const [isOpen, setIsOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && !user && !loading) {
      dispatch(getUser());
    }
  }, [isAuthenticated, user, loading, dispatch]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
    router.push("/");
  };

  const setTestUser = (token: string) => {
    localStorage.setItem("evrika-access-token", token);
    dispatch(initializeAuth());
    dispatch(getUser());
  };

  return (
    <header className={styles.header}>
      <div className={classNames(styles.header__container, "container")}>
        <div className={styles.header__logo}>
          <Link href="/">
            <Logo />
          </Link>
        </div>

        <nav className={styles.header__menu}>
          <ul>
            {menu.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.link}
                  className={classNames({
                    [styles.active]: pathname === item.link,
                  })}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.buttons}>
          <button
            onClick={() =>
              setTestUser(
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0IiwiYXVkIjpbImZhc3RhcGktdXNlcnM6YXV0aCJdLCJleHAiOjE3NTUzNDQ1NzB9.gla_5czweUhBXBLL5OHArEf54d1ms9IZzAGUZS9VY6A"
              )
            }
          >
            Ученик
          </button>
          <button
            onClick={() =>
              setTestUser(
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiYXVkIjpbImZhc3RhcGktdXNlcnM6YXV0aCJdLCJleHAiOjE3NTU4OTU2NzN9.D-ND4Ygj9uTz8pzoKQ9ctxI9UicyZMnHvLUA6rXBQlc"
              )
            }
          >
            Учитель
          </button>
        </div>

        {isAuthenticated ? (
          <div
            ref={profileRef}
            onClick={() => setIsOpen((prev) => !prev)}
            className={styles.header__profile}
          >
            <Profile />
            <PopupHeader
              isOpen={isOpen}
              user={user}
              onLogout={handleLogout}
              isAuthenticated={isAuthenticated}
            />
          </div>
        ) : (
          <Link style={{ color: "#fff" }} href="/auth/login">
            Войти
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
