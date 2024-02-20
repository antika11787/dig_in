import "./index.scss";import React from "react";
import "./index.scss";

interface CheckboxProps {
  text: string;
  display: string;
  checked?: boolean;
  onChange?: (value: string) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ text, display, checked , onChange }) => {
  return (
    <div
      style={{
        display: display,
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <input
        type="checkbox"
        className="ui-checkbox"
        checked={checked}
        onChange={(e) => {
          if (onChange) {
            onChange(text);
          }
        }}
      />
      <label
        style={{
          marginLeft: "8px",
          position: "relative",
          top: "-1px",
        }}
        className="ui-checkbox-label"
      >
        {text}
      </label>
    </div>
  );
};

export default Checkbox;
