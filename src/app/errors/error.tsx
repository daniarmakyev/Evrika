"use client";

import { useEffect } from "react";
import Link from "next/link";
import styles from "./styles.module.scss";
import Image from "next/image";
import ErrorLayout from "./layout";

export default function GlobalError({
  error,
}: {
  error: Error;
}) {
  useEffect(() => {
    console.error("500 error:", error);
  }, [error]);

  return (
    <ErrorLayout>
      <div className={styles.wrapper__serverError}>
        <Image
          src="/assets/images/500dog.png"
          alt="image 500 error"
          width={800}
          height={800}
          priority
        />
        <h2 className={styles.title}>Внутренняя ошибка сервера!</h2>
        <Link href="/" className={styles.link}>
          На главную
        </Link>
      </div>
    </ErrorLayout>
  );
}