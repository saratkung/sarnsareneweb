"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/cn";

const labelCls = "block text-[10px] tracking-widest2 uppercase text-text-muted mb-2";
const controlCls =
  "w-full h-11 bg-transparent border-b border-text-light/20 text-[14px] text-text-light " +
  "font-sans placeholder:text-text-light/30 focus:outline-none focus:border-text-light " +
  "transition-colors duration-300 disabled:opacity-40";
const errorCls = "mt-1.5 text-[11px] text-[#9d5c4d]";

type BaseProps = {
  label: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
};

type TextFieldProps = BaseProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "className">;

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, error, hint, containerClassName, id, ...rest },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <div className={cn(containerClassName)}>
      <label htmlFor={fieldId} className={labelCls}>
        {label}
      </label>
      <input
        ref={ref}
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={cn(controlCls, error && "border-[#9d5c4d]")}
        {...rest}
      />
      {hint && !error && <p className="mt-1.5 text-[11px] text-text-muted">{hint}</p>}
      {error && (
        <p id={`${fieldId}-error`} className={errorCls}>
          {error}
        </p>
      )}
    </div>
  );
});

type SelectFieldProps = BaseProps &
  Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "className"> & {
    children: React.ReactNode;
  };

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  function SelectField({ label, error, hint, containerClassName, id, children, ...rest }, ref) {
    const autoId = useId();
    const fieldId = id ?? autoId;
    return (
      <div className={cn(containerClassName)}>
        <label htmlFor={fieldId} className={labelCls}>
          {label}
        </label>
        <select
          ref={ref}
          id={fieldId}
          className={cn(
            controlCls,
            "appearance-none bg-[right_0.25rem_center] bg-no-repeat pr-6",
            error && "border-[#9d5c4d]",
          )}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23999' fill='none' stroke-width='1'/%3E%3C/svg%3E\")",
          }}
          {...rest}
        >
          {children}
        </select>
        {hint && !error && <p className="mt-1.5 text-[11px] text-text-muted">{hint}</p>}
        {error && <p className={errorCls}>{error}</p>}
      </div>
    );
  },
);
