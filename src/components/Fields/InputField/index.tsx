import React, { InputHTMLAttributes, forwardRef } from "react";
import styles from "./styles.module.scss";

interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'style'> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  style?: React.CSSProperties;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  readOnly?: boolean;
  maxLength?: number;
  minLength?: number;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ 
    label, 
    error, 
    fullWidth = false, 
    style = {}, 
    placeholder,
    leftIcon,
    ...props 
  }, ref) => {
    return (
      <div className={`${styles.inputWrapper} ${fullWidth ? styles.fullWidth : ""}`}>
        {label && <label className={styles.label}>{label}</label>}
        <div className={styles.inputContainer}>
          {leftIcon && <div className={styles.leftIcon}>{leftIcon}</div>}
          <input
            style={style}
            ref={ref}
            className={`${styles.input} ${error ? styles.error : ""} ${leftIcon ? styles.withLeftIcon : ""}`}
            placeholder={placeholder}
            {...props}
          />
        </div>
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;
