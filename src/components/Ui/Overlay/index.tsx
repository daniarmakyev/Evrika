import React from "react";
import styles from "./styles.module.scss";

interface OverlayProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const Overlay: React.FC<OverlayProps> = ({
  children,
  style = {},
  className = "",
}) => {
  return (
    <div 
      className={`${styles.overlay} ${className}`} 
      style={style}
    >
      {children}
    </div>
  );
};

export default Overlay;