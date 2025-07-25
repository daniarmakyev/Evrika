import React, { ChangeEvent, forwardRef, SelectHTMLAttributes } from "react";
import styles from "./styles.module.scss";
import classNames from "classnames";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "style"> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  style?: React.CSSProperties;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  isShadow?: boolean;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  value?: string;
  options: SelectOption[];
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLSelectElement>) => void;
}

const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  (
    {
      label,
      error,
      fullWidth = false,
      style = {},
      placeholder,
      leftIcon,
      isShadow = false,
      disabled,
      required,
      name,
      id,
      value,
      options,
      onChange,
      onBlur,
      onFocus,
      ...rest
    },
    ref
  ) => {
    return (
      <div
        className={`${styles.inputWrapper} ${
          fullWidth ? styles.fullWidth : ""
        }`}
      >
        {label && (
          <label htmlFor={id} className={styles.label}>
            {label}
          </label>
        )}
        <div
          className={classNames(styles.inputContainer, {
            [styles.shadow]: isShadow,
          })}
        >
          {leftIcon && <div className={styles.leftIcon}>{leftIcon}</div>}
          <select
            id={id}
            ref={ref}
            style={style}
            className={`${styles.select} ${error ? styles.error : ""} ${
              leftIcon ? styles.withLeftIcon : ""
            } ${!value ? styles.placeholder : ""}`}
            disabled={disabled}
            required={required}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            {...rest}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className={styles.selectArrow}>
            <svg
              width="12"
              height="8"
              viewBox="0 0 12 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1.5L6 6.5L11 1.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  }
);

SelectField.displayName = "SelectField";

export default SelectField;