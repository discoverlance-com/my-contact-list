import { CheckIcon, LoaderIcon, XIcon } from "lucide-react";
import * as React from "react";
import { useSpinDelay } from "spin-delay";

import { Button, type ButtonProps } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

export const StatusButton = ({
  spinDelay,
  status,
  message,
  className,
  children,
  ...props
}: ButtonProps & {
  status: "pending" | "success" | "error" | "idle";
  message?: string | null;
  spinDelay?: Parameters<typeof useSpinDelay>[1];
}) => {
  const delayedPending = useSpinDelay(status === "pending", {
    delay: 400,
    minDuration: 300,
    ...spinDelay,
  });
  const companion = {
    pending: delayedPending ? (
      <div
        role="status"
        className="inline-flex h-4 w-4 items-center justify-center"
      >
        <LoaderIcon className="animate-spin" />
      </div>
    ) : null,
    success: (
      <div
        role="status"
        className="inline-flex h-4 w-4 items-center justify-center"
      >
        <CheckIcon />
      </div>
    ),
    error: (
      <div
        role="status"
        className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-destructive"
      >
        <XIcon className="text-destructive-foreground" />
      </div>
    ),
    idle: null,
  }[status];

  return (
    <Button className={cn("flex justify-center gap-4", className)} {...props}>
      <div>{children}</div>
      {message ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>{companion}</TooltipTrigger>
            <TooltipContent>{message}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        companion
      )}
    </Button>
  );
};
