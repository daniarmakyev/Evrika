import InputField from "@components/Fields/InputField";
import React from "react";
import Image from "next/image";
import Overlay from "@components/Ui/Overlay";
import styles from "./styles.module.scss";
import FormButton from "@components/Ui/FormButton";

const Login = () => {
  return (
    <div className={styles.wrapper}>
      <Overlay
        style={{
          minHeight: "fit-content",
          height:"90vh",
          maxHeight: "900px",
          maxWidth: "1440px",
          width: "90vw",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          margin: "auto auto",
        }}
      >
        <div className={styles.wrapper__innerOverlay}>
          <div>
            <h2 className={styles.wrapper__title}>Вход</h2>
            <p className={styles.wrapper__description}>
              Введите почту и пароль для входа
            </p>
          </div>
          <form className={styles.wrapper__form}>
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
            <FormButton type="submit">Войти</FormButton>
          </form>
        </div>
      </Overlay>
    </div>
  );
};

export default Login;
