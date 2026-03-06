"use client";

import { useMutation } from "@tanstack/react-query";

interface KybResponse {
  tokenString: string;
  url: string;
}

export function useKybVerification() {
  return useMutation({
    mutationFn: async (dealId: number): Promise<KybResponse> => {
      const response = await fetch("/api/idenfy/kyb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: `deal_${dealId}` }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate KYB verification URL");
      }

      return response.json();
    },
    onSuccess: (data) => {
      window.open(data.url, "_blank", "noopener,noreferrer");
    },
  });
}

