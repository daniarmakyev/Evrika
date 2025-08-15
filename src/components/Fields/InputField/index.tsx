import React, { ChangeEvent, forwardRef, InputHTMLAttributes } from "react";
import styles from "./styles.module.scss";
import classNames from "classnames";

interface InputFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "style"> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  style?: React.CSSProperties;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  isShadow?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  minLength?: number;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  type?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      error,
      fullWidth = false,
      style = {},
      placeholder,
      leftIcon,
      isShadow = false,
      readOnly,
      maxLength,
      minLength,
      disabled,
      required,
      name,
      id,
      type,
      value,
      onChange,
      onBlur,
      onFocus,
      ...rest
    },
    ref
  ) => {
    return (
      <div
        style={style}
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
          <input
            id={id}
            ref={ref}
            className={`${styles.input} ${error ? styles.error : ""} ${
              leftIcon ? styles.withLeftIcon : ""
            }`}
            placeholder={placeholder}
            readOnly={readOnly}
            maxLength={maxLength}
            minLength={minLength}
            disabled={disabled}
            required={required}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            {...rest}
          />
        </div>
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;
