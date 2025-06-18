import React, { ButtonHTMLAttributes, forwardRef } from "react";
import styles from "./style.module.scss";

type ButtonType = "button" | "submit" | "reset";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style" | "className" | "type"> {
  fullWidth?: boolean;
  style?: React.CSSProperties;
  children: React.ReactNode;
  disabled?: boolean;
  type?: ButtonType;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
}

const FormButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      fullWidth = false,
      style = {},
      children,
      disabled = false,
      type = "button",
      onClick,
      onFocus,
      ...rest
    },
    ref
  ) => {
    const buttonStyle = {
      ...style,
      width: fullWidth ? "100%" : undefined,
      opacity: disabled ? 0.6 : 1,
      cursor: disabled ? "not-allowed" : "pointer",
    };

    return (
      <button
        ref={ref}
        style={buttonStyle}
        type={type}
        disabled={disabled}
        className={styles.button}
        onClick={onClick}
        onFocus={onFocus}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

FormButton.displayName = "FormButton";

export default FormButton; 