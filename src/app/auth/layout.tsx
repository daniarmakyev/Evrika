import Header from "@components/Header";
import type { Metadata } from "next";
import styles from "./styles.module.scss";

export const metadata: Metadata = {
  title: "Эврика авторизация",
  description: "Аторизация пользователя.",
  icons: {
    icon: "/favicon.ico",
  }
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.wrapper}>
      <Header />
      {children}
    </div>
  );
}
