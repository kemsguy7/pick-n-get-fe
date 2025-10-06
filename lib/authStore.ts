import { create } from "zustand";
import { ConfirmationResult } from "firebase/auth";

interface AuthStore {
  confirmationResult: ConfirmationResult | null;
  setConfirmationResult: (val: ConfirmationResult | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  confirmationResult: null,
  setConfirmationResult: (val) => set({ confirmationResult: val }),
}));
