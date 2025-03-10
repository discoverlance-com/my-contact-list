import { useEffect } from "react";
import { toast as showToast } from "sonner";

export function useToast(
  toast?: {
    type: "info" | "success" | "error" | "warning";
    id: string;
    description: string;
    position:
      | "top-right"
      | "top-center"
      | "top-left"
      | "bottom-right"
      | "bottom-center"
      | "bottom-left";
    title?: string | undefined;
  } | null
) {
  useEffect(() => {
    if (toast) {
      setTimeout(() => {
        showToast[toast.type](toast.title, {
          id: toast.id,
          description: toast.description,
          position: toast.position,
        });
      }, 0);
    }
  }, [toast]);
}
