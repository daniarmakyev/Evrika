import React, { ChangeEvent, forwardRef, TextareaHTMLAttributes } from "react";
import styles from "./styles.module.scss";
import classNames from "classnames";

interface TextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "style"> {
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
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
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
        className={`${styles.textareaWrapper} ${
          fullWidth ? styles.fullWidth : ""
        }`}
      >
        {label && (
          <label htmlFor={id} className={styles.label}>
            {label}
          </label>
        )}
        <div
          className={classNames(styles.textareaContainer, {
            [styles.shadow]: isShadow,
          })}
        >
          {leftIcon && <div className={styles.leftIcon}>{leftIcon}</div>}
          <textarea
            id={id}
            ref={ref}
            style={style}
            className={`${styles.textarea} ${error ? styles.error : ""} ${
              leftIcon ? styles.withLeftIcon : ""
            }`}
            placeholder={placeholder}
            readOnly={readOnly}
            maxLength={maxLength}
            minLength={minLength}
            disabled={disabled}
            required={required}
            name={name}
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

TextArea.displayName = "TextArea";

export default TextArea;
