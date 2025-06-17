import React from "react";
import Link from "next/link";
import classNames from "classnames";
import Instagram from "@icons/instagram.svg";
import Facebook from "@icons/facebook.svg";
import styles from "./styles.module.scss";

const social = [
  {
    name: "Instagram",
    icon: <Instagram />,
    link: "https://www.instagram.com/reviro_io/",
  },
  {
    name: "Facebook",
    icon: <Facebook />,
    link: "https://www.facebook.com/reviro.software/",
  },
];

const menu = [
  {
    name: "О школе",
    link: "/",
  },
  {
    name: "Курсы",
    link: "/",
  },
  {
    name: "Контакты",
    link: "/",
  },
];

const Footer = ({}) => {
  return (
    <footer className={classNames(styles.footer, "container")}>
      <div className={styles.footer__container}>
        <div className={styles.footer__info}>
          <div className={styles.footer__social}>
            {social.map((item, index) => (
              <div key={index} className={styles.footer__icon}>
                <Link href={item.link} target="_blank">
                  {item.icon}
                </Link>
              </div>
            ))}
          </div>
          <div className={styles.footer__company}>
            <p>​Бишкек, Микрорайон Асанбай, 27/1</p>
            <a href="tel:+996554450026">+996 (554) 450-026</a>
            <a href="mailto:hello@reviro.io">hello@reviro.io</a>
          </div>
        </div>
        <div className={styles.footer__menu}>
          {menu.map((item, index) => (
            <Link key={index} href={item.link}>
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
};

export default Footer;