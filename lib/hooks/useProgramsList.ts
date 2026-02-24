"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProgramsList } from "@/lib/subgraph/client";

export function useProgramsList() {
  const enabled = Boolean(process.env.NEXT_PUBLIC_SUBGRAPH_URL);
  return useQuery({
    queryKey: ["programsList"],
    queryFn: fetchProgramsList,
    enabled,
  });
}
