"use client";
import React from "react";
import styles from "./styles.module.scss";

interface DropdownMenuProps {
  options: string[];
  onSelect: (option: string) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ options, onSelect }) => {
  return (
    <ul className={styles.dropdownMenu}>
      {options.map((option) => (
        <li
          key={option}
          onClick={() => onSelect(option)}
          className={styles.dropdownItem}
        >
          {option}
        </li>
      ))}
    </ul>
  );
};

export default DropdownMenu;
