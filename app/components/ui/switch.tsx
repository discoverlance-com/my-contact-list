import * as React from "react";
import { cn } from "~/lib/utils";

export type SwitchProps = React.ComponentProps<"input"> & {
  label?: string;
};

function Switch({ className, label, ...props }: SwitchProps) {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        className={cn(
          "relative w-10 h-5 rounded-full bg-gray-300 shadow-inner appearance-none cursor-pointer transition-all",
          "checked:bg-primary checked:shadow-md",
          "before:content-[''] before:absolute before:top-1/2 before:left-1 before:h-3 before:w-3 before:bg-white before:rounded-full before:transition-transform before:-translate-y-1/2",
          "checked:before:translate-x-5",
          "focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
      {label && <span className="text-sm text-foreground">{label}</span>}
    </label>
  );
}

export { Switch };
