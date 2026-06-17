"use client";

import { ReactNode, useMemo } from "react";
import { Toaster, toast as sonnerToast } from "sonner";

type ToastInput = {
  title: string;
  message?: string;
};

function description(message?: string) {
  return message ? { description: message } : undefined;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        richColors
        closeButton
        position="top-right"
        toastOptions={{
          classNames: {
            toast:
              "rounded-2xl border border-sky-100 shadow-[0_18px_45px_rgba(15,23,42,0.16)]",
            title: "font-black",
            description: "font-semibold",
          },
        }}
      />
    </>
  );
}

export function useToast() {
  return useMemo(
    () => ({
      success: ({ title, message }: ToastInput) =>
        sonnerToast.success(title, description(message)),
      error: ({ title, message }: ToastInput) =>
        sonnerToast.error(title, description(message)),
      info: ({ title, message }: ToastInput) =>
        sonnerToast.info(title, description(message)),
    }),
    []
  );
}
