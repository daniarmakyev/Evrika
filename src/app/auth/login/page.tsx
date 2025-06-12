import InputField from "@components/Fields/InputField";
import React from "react";
import Image from "next/image";
import Overlay from "@components/Ui/Overlay";
import styles from "./styles.module.scss";

const page = () => {
  return (
    <div className={styles.wrapper}>
      <Overlay
        style={{
          maxWidth: "840px",
          height: "80vh",
          maxHeight: "900px",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        <div className={styles.innerOverlay}>
          <div>
            <h2 className={styles.title}>Вход</h2>
            <p className={styles.description}>
              Введите почту и пароль для входа
            </p>
          </div>
          <form className={styles.form}>
            <InputField
              placeholder="почта"
              label="Вход"
              name="почта"
              leftIcon={
                <Image
                  src="/assets/icons/user.svg"
                  alt="user"
                  width={18}
                  height={18}
                  style={{
                    borderRadius: "6px",
                  }}
                />
              }
              fullWidth
            />
            <InputField
              placeholder="пароль"
              label="Пароль"
              name="пароль"
              leftIcon={
                <Image
                  src="/assets/icons/user.svg"
                  alt="user"
                  width={18}
                  height={18}
                  style={{
                    borderRadius: "6px",
                  }}
                />
              }
              fullWidth
            />
            <button>Войти</button>
          </form>
        </div>
      </Overlay>
    </div>
  );
};

export default page;
