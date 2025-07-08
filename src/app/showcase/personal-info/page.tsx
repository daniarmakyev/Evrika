"use client";

import styles from "./styles.module.scss";
import InputField from "@components/Fields/InputField";
import classNames from "classnames";
import { useForm, Controller } from "react-hook-form";

interface FormData {
  firstName?: string;
  lastName?: string;
  courses: string;
  phone: string;
  email: string;
  address: string;
  fullName?: string;
}

export default function PersonalInfo() {
  const { control } = useForm<FormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      courses: "",
      phone: "",
      email: "",
      address: "",
    },
  });

  return (
    <div className={classNames(styles.personalInfoContainer, "container")}>
      <div className={styles.personalInfoWrapper}>
        <h2>Личная информация</h2>
        <form>
          <Controller
            name="fullName"
            control={control}
            render={({ field }) => (
              <InputField
                {...field}
                label="Имя и фамилия"
                placeholder="Введите имя и фамилию"
                disabled
              />
            )}
          />

          <Controller
            name="courses"
            control={control}
            render={({ field }) => (
              <InputField
                {...field}
                label="Курсы"
                placeholder="Введите курсы"
                disabled
              />
            )}
          />

          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <InputField
                {...field}
                label="Телефон"
                placeholder="+7 (999) 999-99-99"
                disabled
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <InputField
                {...field}
                label="Почта"
                type="email"
                placeholder="example@mail.com"
                disabled
              />
            )}
          />

          {/* <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <InputField
                {...field}
                label="Адрес"
                placeholder="Введите ваш адрес"
                disabled
              />
            )}
          /> */}
        </form>
        {/* <div className={styles.buttonContainer}>
          <button>
            <span>Изменить</span>
          </button>
        </div> */}
      </div>
    </div>
  );
}
