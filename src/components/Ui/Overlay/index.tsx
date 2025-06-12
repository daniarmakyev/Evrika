import React from "react";
import styles from "./styles.module.scss";

const Overlay = ({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}) => {
  return (
    <div className={styles.overlay} style={style}>
      {children}
    </div>
  );
};

export default Overlay;
