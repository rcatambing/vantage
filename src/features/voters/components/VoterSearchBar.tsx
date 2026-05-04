import { useState, useEffect, useRef, useCallback } from "react";
import { InputGroup, Button } from "@blueprintjs/core";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function VoterSearchBar({ value, onChange }: Props) {
  const [inputValue, setInputValue] = useState(value);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value;
      setInputValue(next);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        onChange(next);
      }, 300);
    },
    [onChange],
  );

  const handleClear = useCallback(() => {
    setInputValue("");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onChange("");
  }, [onChange]);

  return (
    <InputGroup
      placeholder="Search voter registry…"
      value={inputValue}
      onChange={handleChange}
      leftIcon="search"
      aria-label="Search voter registry"
      rightElement={
        inputValue ? (
          <Button minimal small icon="cross" onClick={handleClear} />
        ) : undefined
      }
      style={{ width: 280 }}
    />
  );
}
