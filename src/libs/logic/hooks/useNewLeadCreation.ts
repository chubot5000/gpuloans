"use client";

import { useMutation } from "@tanstack/react-query";
import { createQuoteRequest, type CreateQuoteRequestParams } from "data/fetchers";

export function useNewLeadCreation() {
  return useMutation({
    mutationFn: (params: CreateQuoteRequestParams) => createQuoteRequest(params),
  });
}
