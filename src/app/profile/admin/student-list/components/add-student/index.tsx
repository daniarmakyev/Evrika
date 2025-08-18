import ProfileModal from "@components/ProfileModal";
// import TextArea from "@components/Fields/TextAreaField";
import InputField from "@components/Fields/InputField";
import React from "react";
import styles from "./styles.module.scss";
import { ChevronDown } from "lucide-react";

import { useForm, Controller } from "react-hook-form";
// import SelectField from "@components/Fields/SelectField";
// import { FolderUp } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

interface FormData {
  firstName?: string;
  lastName?: string;
  group: string[];
  phone: string;
  email: string;
  fullName?: string;
}

const AddStudent: React.FC<Props> = ({ isOpen, onClose }) => {
  const [openDropdown, setOpenDropdown] = React.useState(false);
  const [openAccordion, setOpenAccordion] = React.useState<string | null>(null);
  const { control, watch } = useForm<FormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      group: [],
      phone: "",
      email: "",
    },
  });
  const selectedCourse = watch("group");

  return (
    <ProfileModal
      isOpen={isOpen}
      onClose={onClose}
      title="Добавление студента"
      size="lg"
    >
      <form className={styles.form}>
        <Controller
          name="fullName"
          control={control}
          render={({ field }) => (
            <InputField
              {...field}
              isShadow
              fullWidth
              style={{ maxWidth: "45%" }}
              label="Имя и фамилия"
              placeholder="Введите имя и фамилию"
            />
          )}
        />

        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <InputField
              {...field}
              isShadow
              fullWidth
              style={{ maxWidth: "45%" }}
              // value={user.phone_number || ""}
              label="Телефон"
              placeholder="+7 (999) 999-99-99"
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <InputField
              {...field}
              isShadow
              fullWidth
              style={{ maxWidth: "45%" }}
              // value={user.email}
              label="Почта"
              type="email"
              placeholder="example@mail.com"
            />
          )}
        />
        {/* <Controller
          name="groups"
          control={control}
          render={({ field }) => (
            <SelectField
              {...field}
              label="Выберите курс"
              isShadow
              fullWidth
              style={{ maxWidth: "45%" }}
              options={groups.map((group) => ({
                label: group.label,
                value: group.label,
              }))}
            />
          )}
        /> */}
        <div className={styles.dropdown}>
          {/* Dropdown trigger */}
          <button
            type="button"
            className={styles.dropdown__trigger}
            onClick={() => setOpenDropdown(!openDropdown)}
          >
            {selectedCourse && selectedCourse.length > 0
              ? selectedCourse.length === 1
                ? selectedCourse
                : selectedCourse.length >= 2 && selectedCourse.length <= 4
                ? `Выбрано ${selectedCourse.length} группы`
                : `Выбрано ${selectedCourse.length} групп`
              : "Выберите группы"}
            <ChevronDown className={styles.dropdown__icon} />
          </button>

          {/* Dropdown content */}
          {openDropdown && (
            <div className={styles.dropdown__content}>
              {groups.map((group, index) => (
                <div key={index}>
                  {/* Accordion header */}
                  <button
                    type="button"
                    className={`${styles.dropdown__accordion_header} ${
                      openAccordion === group.label ? styles.open : ""
                    }`}
            
                    onClick={() =>
                      setOpenAccordion(
                        openAccordion === group.label ? null : group.label
                      )
                    }
                  >
                    {group.label}
                    <span>{openAccordion === group.label ? "-" : "+"}</span>
                  </button>

                  {/* Accordion body */}
                  {openAccordion === group.label && (
                    <div className="pl-4 py-2">
                      <Controller
                        control={control}
                        name="group"
                        render={({ field }) => (
                          <div className="flex flex-col gap-1">
                            {group.options.map((option, index) => (
                              <label
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <input
                                  type="checkbox"
                                  value={option.value}
                                  checked={field.value.includes(option.value)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      field.onChange([
                                        ...field.value,
                                        option.value,
                                      ]); // add to array
                                    } else {
                                      field.onChange(
                                        field.value.filter(
                                          (val) => val !== option.value
                                        ) // remove from array
                                      );
                                    }
                                  }}
                                />
                                {option.label}
                              </label>
                            ))}
                          </div>
                        )}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.button_container}>
          <button className={styles.cancel__button} type="button">
            Отмена
          </button>
          <button className={styles.save__button}>Добавить</button>
        </div>
      </form>
    </ProfileModal>
  );
};

export default AddStudent;
export const groups = [
  {
    label: "Английский язык",
    baseColor: "#4a90e2",
    options: [
      {
        label: "Английский язык A1-0925",
        value: "Английский язык A1-0925",
        dotColor: "#9b59b6",
      },
      {
        label: "Английский язык B1-0925",
        value: "Английский язык B1-0925",
        dotColor: "#2ecc71",
      },
      {
        label: "Английский язык B2-0925",
        value: "Английский язык B2-0925",
        dotColor: "#f1c40f",
      },
      {
        label: "Английский язык C1-0925",
        value: "Английский язык C1-0925",
        dotColor: "#e74c3c",
      },
    ],
  },
  {
    label: "Японский язык",
    baseColor: "#ff9800",
    options: [
      {
        label: "Японский язык N5-0925",
        value: "Японский язык N5-0925",
        dotColor: "#ff9800",
      },
    ],
  },
];
