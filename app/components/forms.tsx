import React, { useId } from "react";

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { PhoneInput, type PhoneInputProps } from "./phone-input";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";

export type ListOfErrors = Array<string | null | undefined> | null | undefined;

export function ErrorList({
  id,
  errors,
}: {
  errors?: ListOfErrors;
  id?: string;
}) {
  const errorsToRender = errors?.filter(Boolean);
  if (!errorsToRender?.length) return null;
  return (
    <ul
      id={id}
      className="flex flex-col gap-1 transition-all duration-200 motion-reduce:transition-none"
    >
      {errorsToRender.map((e) => (
        <li key={e} className="text-[0.8rem] text-destructive">
          {e}
        </li>
      ))}
    </ul>
  );
}

export function InputField({
  labelProps,
  inputProps,
  errors,
  className,
  helperText,
}: {
  labelProps: React.LabelHTMLAttributes<HTMLLabelElement>;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
  errors?: ListOfErrors;
  helperText?: string;
  className?: string;
}) {
  const fallbackId = useId();
  const id = inputProps.id ?? fallbackId;
  const errorId = errors?.length ? `${id}-error` : undefined;
  const helperTextId = helperText ? `${id}-helper-text` : undefined;
  const ariaDescribedBy =
    errorId && helperTextId
      ? `${errorId} ${helperTextId}`
      : errorId || helperTextId;

  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={id} {...labelProps} />
      <Input
        id={id}
        aria-invalid={errorId ? true : undefined}
        aria-describedby={ariaDescribedBy}
        {...inputProps}
      />
      <div className="px-2">
        {errorId ? <ErrorList id={errorId} errors={errors} /> : null}
        {helperText && (
          <p className="text-[0.8rem] text-muted-foreground" id={helperTextId}>
            {helperText}
          </p>
        )}
      </div>
    </div>
  );
}

export function PhoneInputField({
  labelProps,
  inputProps,
  errors,
  className,
  helperText,
}: {
  labelProps: React.LabelHTMLAttributes<HTMLLabelElement>;
  inputProps: PhoneInputProps;
  errors?: ListOfErrors;
  helperText?: string;
  className?: string;
}) {
  const fallbackId = useId();
  const id = inputProps.id ?? fallbackId;
  const errorId = errors?.length ? `${id}-error` : undefined;
  const helperTextId = helperText ? `${id}-helper-text` : undefined;
  const ariaDescribedBy =
    errorId && helperTextId
      ? `${errorId} ${helperTextId}`
      : errorId || helperTextId;

  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={id} {...labelProps} />
      <PhoneInput
        id={id}
        aria-invalid={errorId ? true : undefined}
        aria-describedby={ariaDescribedBy}
        {...inputProps}
      />
      <div className="px-2">
        {errorId ? <ErrorList id={errorId} errors={errors} /> : null}
        {helperText && (
          <p className="text-[0.8rem] text-muted-foreground" id={helperTextId}>
            {helperText}
          </p>
        )}
      </div>
    </div>
  );
}

export function TextareaField({
  labelProps,
  textareaProps,
  errors,
  className,
  helperText,
}: {
  labelProps: React.LabelHTMLAttributes<HTMLLabelElement>;
  textareaProps: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
  errors?: ListOfErrors;
  helperText?: string;
  className?: string;
}) {
  const fallbackId = useId();
  const id = textareaProps.id ?? textareaProps.name ?? fallbackId;
  const errorId = errors?.length ? `${id}-error` : undefined;
  const helperTextId = helperText ? `${id}-helper-text` : undefined;
  const ariaDescribedBy =
    errorId && helperTextId
      ? `${errorId} ${helperTextId}`
      : errorId || helperTextId;

  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={id} {...labelProps} />
      <Textarea
        id={id}
        aria-invalid={errorId ? true : undefined}
        aria-describedby={ariaDescribedBy}
        {...textareaProps}
      />
      <div className="px-2">
        {errorId ? <ErrorList id={errorId} errors={errors} /> : null}
        {helperText && (
          <p className="text-[0.8rem] text-muted-foreground" id={helperTextId}>
            {helperText}
          </p>
        )}
      </div>
    </div>
  );
}
