import React from "react";
import styles from "./styles.module.scss";

interface OverlayProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const Overlay = ({
  children,
  style,
  className="",
}: OverlayProps) => {
  return (
    <div className={`${styles.overlay} ${className}`}>
      {children}
    </div>
  );
};

export default Overlay;
