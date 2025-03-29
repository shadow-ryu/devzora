"use client"
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface QrFormFieldProps {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}

interface QrColorPickerProps {
    label: string;
    name: string;
    value: string;
    onChange: (color: string, name: string) => void;
  }
  
  const colorPresets = [
    "#000000",
    "#FFFFFF",
    "#8B5CF6",
    "#EC4899",
    "#F97316",
    "#EAB308",
    "#22C55E",
    "#0EA5E9",
    "#6366F1",
    "#D946EF",
  ];

export const QrFormField: React.FC<QrFormFieldProps> = ({
  label,
  name,
  type,
  value,
  onChange,
  placeholder,
  required = false,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name.replace(".", "-")}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        type={type}
        id={name.replace(".", "-")}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full"
      />
    </div>
  );
};



export const QrColorPicker: React.FC<QrColorPickerProps> = ({
  label,
  name,
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor={name.replace(".", "-")}>{label}</Label>
      <div className="flex gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-4 w-4 rounded"
                  style={{ backgroundColor: value }}
                />
                <span>{value}</span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor={`${name.replace(".", "-")}-input`}>
                    Color
                  </Label>
                </div>
                <Input
                  id={`${name.replace(".", "-")}-input`}
                  type="color"
                  value={value}
                  onChange={(e) => onChange(e.target.value, name)}
                  className="h-10 w-full"
                />
              </div>
              <div className="space-y-2">
                <Label>Presets</Label>
                <div className="grid grid-cols-5 gap-2">
                  {colorPresets.map((preset) => (
                    <Button
                      key={preset}
                      variant="outline"
                      className="w-full h-6 p-0"
                      style={{
                        backgroundColor: preset,
                        border:
                          value === preset ? "2px solid black" : undefined,
                      }}
                      onClick={() => {
                        onChange(preset, name);
                        setOpen(false);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
