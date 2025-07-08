import React from "react";
import classNames from "classnames";
import styles from "./styles.module.scss";

export const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"] as const;
export type DayOfWeek = typeof daysOfWeek[number];

interface DaysWeekSelectorProps {
  activeDay: DayOfWeek;
  onDayChange: (day: DayOfWeek) => void;
  className?: string;
  customDays?: readonly string[];
}

const DaysWeekSelector: React.FC<DaysWeekSelectorProps> = ({
  activeDay,
  onDayChange,
  className = "",
  customDays = daysOfWeek,
}) => {
  return (
    <div className={classNames(styles.daysWeek, className)}>
      {customDays.map((day, index) => (
        <button
          key={index}
          onClick={() => onDayChange(day as DayOfWeek)}
          className={classNames(styles.daysWeek__btn, {
            [styles.daysWeek__btn_active]: activeDay === day,
          })}
        >
          <span>{day}</span>
        </button>
      ))}
    </div>
  );
};

export default DaysWeekSelector;