

"use client";
import Select, { MultiValue } from "react-select";

export type Option = { value: number; label: string };

export default function CategoryMultiSelect({
  options,
  value,
  onChange,
}: {
  options: Option[];
  value: number[];                 // selected category IDs
  onChange: (ids: number[]) => void;
}) {
  const selected = options.filter(o => value.includes(o.value));
  function handleChange(next: MultiValue<Option>) {
    onChange(next.map(o => o.value));
  }

  return (
    <Select
      options={options}
      value={selected}
      onChange={handleChange}
      isMulti
      placeholder="Filter categories…"
      className="min-w-[260px]"
    />
  );
}
