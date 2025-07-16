import React from "react";
import classNames from "classnames";
import styles from "./styles.module.scss";

export type DayOfWeek = (typeof daysOfWeek)[number]["value"];

export const daysOfWeek = [
  { label: "Пн", value: "MON" },
  { label: "Вт", value: "TUE" },
  { label: "Ср", value: "WED" },
  { label: "Чт", value: "THU" },
  { label: "Пт", value: "FRI" },
  { label: "Сб", value: "SAT" },
  { label: "Вс", value: "SUN" },
] as const;

interface DaysWeekSelectorProps {
  activeDay: DayOfWeek;
  onDayChange: (day: DayOfWeek) => void;
  className?: string;
}

const DaysWeekSelector: React.FC<DaysWeekSelectorProps> = ({
  activeDay,
  onDayChange,
  className = "",
}) => {
  return (
    <div className={classNames(styles.daysWeek, className)}>
      {daysOfWeek.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => onDayChange(value)}
          className={classNames(styles.daysWeek__btn, {
            [styles.daysWeek__btn_active]: activeDay === value,
          })}
        >
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
};

export default DaysWeekSelector;
