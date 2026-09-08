import React, { useState, useEffect, useRef } from 'react';

interface FormattedNumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  allowZero?: boolean;
}

// Format a number into Indonesian dot-separated format (e.g. 100000 -> "100.000")
const formatToDotNumber = (num: number): string => {
  if (num === 0 || isNaN(num)) return '0';
  return num.toLocaleString('id-ID');
};

// Calculate cursor position after formatting to prevent jump to the end
const getCursorPosAfterFormatting = (formattedStr: string, targetDigitCount: number): number => {
  if (targetDigitCount <= 0) return 0;
  let digitCount = 0;
  for (let i = 0; i < formattedStr.length; i++) {
    if (/\d/.test(formattedStr[i])) {
      digitCount++;
    }
    if (digitCount === targetDigitCount) {
      return i + 1;
    }
  }
  return formattedStr.length;
};

export const FormattedNumberInput: React.FC<FormattedNumberInputProps> = ({
  value,
  onChange,
  min = 0,
  max,
  className = '',
  placeholder = '0',
  disabled,
  id,
  ...restProps
}) => {
  const [displayValue, setDisplayValue] = useState<string>(() => formatToDotNumber(value));
  const inputRef = useRef<HTMLInputElement>(null);
  const isEditingRef = useRef(false);

  // Synchronize when value changes externally (e.g. preset loaded, currency switched)
  useEffect(() => {
    if (!isEditingRef.current) {
      setDisplayValue(formatToDotNumber(value));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    isEditingRef.current = true;
    const input = e.target;
    const rawInput = input.value;
    const cursorPosition = input.selectionStart || 0;

    // Count how many digits were before the cursor
    const digitsBeforeCursor = rawInput.slice(0, cursorPosition).replace(/\D/g, '').length;

    // Extract all digits
    const digitsOnly = rawInput.replace(/\D/g, '');

    if (digitsOnly === '') {
      setDisplayValue('');
      onChange(0);
      return;
    }

    let parsed = parseInt(digitsOnly, 10);
    if (isNaN(parsed)) parsed = 0;

    if (min !== undefined && parsed < min) {
      parsed = min;
    }
    if (max !== undefined && parsed > max) {
      parsed = max;
    }

    const formatted = parsed.toLocaleString('id-ID');
    setDisplayValue(formatted);
    onChange(parsed);

    // Reposition cursor right after state update
    requestAnimationFrame(() => {
      if (inputRef.current) {
        const nextCursorPos = getCursorPosAfterFormatting(formatted, digitsBeforeCursor);
        inputRef.current.setSelectionRange(nextCursorPos, nextCursorPos);
      }
    });
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    isEditingRef.current = true;
    if (value === 0 || displayValue === '0') {
      e.target.select();
    }
    if (restProps.onFocus) {
      restProps.onFocus(e);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    isEditingRef.current = false;
    // Format properly on blur
    setDisplayValue(formatToDotNumber(value));
    if (restProps.onBlur) {
      restProps.onBlur(e);
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      id={id}
      disabled={disabled}
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={className}
      {...restProps}
    />
  );
};
