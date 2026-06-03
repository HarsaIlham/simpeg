import React, { useState, useEffect } from 'react';
import Checkbox from '../../atoms/Checkbox';
import styles from './SingleCheckboxGroup.module.css';

export interface CheckboxOption {
  label: string;
  value: string;
}

interface SingleCheckboxGroupProps {
  label?: string;
  name?: string;
  options: CheckboxOption[];
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
}

const SingleCheckboxGroup: React.FC<SingleCheckboxGroupProps> = ({
  label,
  name,
  options,
  value,
  onChange,
  disabled,
  required
}) => {
  const [selectedValue, setSelectedValue] = useState<string>(value || "");

  useEffect(() => {
    setSelectedValue(value || "");
  }, [value]);

  const handleToggle = (val: string) => {
    if (disabled) return;
    const newVal = selectedValue === val ? "" : val;
    setSelectedValue(newVal);
    if (onChange) {
      onChange(newVal);
    }
  };

  return (
    <div className={styles.container}>
      {label && (
        <span className={styles.labelText}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </span>
      )}
      <div className={styles.optionsWrapper}>
        {options.map((option) => (
          <Checkbox
            key={option.value}
            name={name}
            label={option.label}
            value={option.value}
            checked={selectedValue === option.value}
            onChange={() => handleToggle(option.value)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
};

export default SingleCheckboxGroup;
