import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ActiveDeployStorage } from "@/lib/hooks/useDeployMinter";

type DeployProgressState = {
  activeDeploy: ActiveDeployStorage | null;
  setActiveDeploy: (data: ActiveDeployStorage | null) => void;
};

export const useDeployProgressStore = create<DeployProgressState>()(
  persist(
    (set) => ({
      activeDeploy: null,
      setActiveDeploy: (data) => set({ activeDeploy: data }),
    }),
    { name: "capped-minter-deploy-progress" }
  )
);
