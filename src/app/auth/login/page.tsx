"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import InputField from "@components/Fields/InputField";
import Overlay from "@components/Ui/Overlay";
import FormButton from "@components/Ui/FormButton";
import UserIcon from "../../../../public/assets/icons/user.svg";
import LockPasswordIcon from "../../../../public/assets/icons/lock-password.svg";
import styles from "./styles.module.scss";
import { useAppDispatch, useAppSelector } from "src/store/store";
import { clearError } from "src/store/user/user.slice";
import { authLogin, getUser } from "src/store/user/user.action";

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loginLoading, isAuthenticated, error, user } = useAppSelector(
    (state) => state.user
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role) {
        localStorage.setItem("role", user.role);
      }
      router.push("/");
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await dispatch(
        authLogin({
          username: data.email,
          password: data.password,
        })
      );

      if (authLogin.fulfilled.match(result)) {
        await dispatch(getUser());
      }
    } catch (error) {
      console.error("Login error:", error);
    }
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
          method="POST"
          className={styles.overlay__wrapper__form}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className={styles.overlay__wrapper__form__inputs}>
            <InputField
              autoComplete="username"
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
              autoComplete="current-password"
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

          {error && <div className={styles.error}>{error}</div>}

          <FormButton
            type="submit"
            disabled={!isValid || loginLoading}
            fullWidth
          >
            {loginLoading ? "ВХОД..." : "ВОЙТИ"}
          </FormButton>
        </form>
      </div>
    </Overlay>
  );
};

export default Login;
