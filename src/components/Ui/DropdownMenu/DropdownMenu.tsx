"use client";
import React from "react";

interface DropdownMenuProps {
  options: string[];
  onSelect: (option: string) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ options, onSelect }) => {
  return (
    <ul
      style={{
        position: "absolute",
        top:'15px',
        left: 0,
        background: "white",
        border: "1px solid #ccc",
        borderRadius: "6px",
        padding: "5px 0",
        listStyle: "none",
        minWidth: "100px",
        zIndex: 100,
      }}
    >
      {options.map((option) => (
        <li
          key={option}
          onClick={() => onSelect(option)}
          style={{
            padding: "5px 10px",
            cursor: "pointer",
            fontSize: "14px",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#f0f0f0")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "white")
          }
        >
          {option}
        </li>
      ))}
    </ul>
  );
};

export default DropdownMenu;
