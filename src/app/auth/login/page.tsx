"use client";

import React from "react";
import { useForm } from "react-hook-form";
import InputField from "@components/Fields/InputField";
import Overlay from "@components/Ui/Overlay";
import FormButton from "@components/Ui/FormButton";
import UserIcon from "../../../../public/assets/icons/user.svg";
import LockPasswordIcon from "../../../../public/assets/icons/lock-password.svg";
import styles from "./styles.module.scss";

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    console.log("Форма отправлена", data);
  };

  return (
    <Overlay className={styles.overlay__wrapper}>
      <div className={styles.overlay__wrapper__innerOverlay}>
        <div>
          <h1 className={styles.overlay__wrapper__title}>ВХОД</h1>
          <p className={styles.overlay__wrapper__description}>
            Введите почту и пароль для входа
          </p>
        </div>
        <form
          className={styles.overlay__wrapper__form}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className={styles.overlay__wrapper__form__inputs}>
            <InputField
              placeholder="почта"
              label="Почта"
              {...register("email", {
                required: "Почта обязательна",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Неверный формат почты",
                },
              })}
              error={errors.email?.message}
              leftIcon={<UserIcon />}
              fullWidth
            />
            <InputField
              placeholder="пароль"
              label="Пароль"
              type="password"
              {...register("password", {
                required: "Пароль обязателен",
                minLength: {
                  value: 6,
                  message: "Пароль должен быть не менее 6 символов",
                },
              })}
              error={errors.password?.message}
              leftIcon={<LockPasswordIcon />}
              fullWidth
            />
          </div>
          <FormButton type="submit">ВОЙТИ</FormButton>
        </form>
      </div>
    </Overlay>
  );
};

export default Login;
