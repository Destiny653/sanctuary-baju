"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { I18nProvider } from "@/i18n";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        {children}
        <Toaster richColors position="top-center" />
      </I18nProvider>
    </QueryClientProvider>
  );
}
