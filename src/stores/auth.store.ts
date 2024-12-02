import { Roles } from "@/enums/role.enum";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
  role: Roles;
}

interface AuthStore {
  user: User | null;
  isAuth: boolean;
  token: string | null;
  login: (user: User) => void;
  logout: () => void;
  deleteStore: () => void;
  setToken: (token: string) => void;
  deleteToken: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuth: false,
      token: null,
      login: (user: User) =>
        set({
          user,
          isAuth: true,
        }),

      logout: () =>
        set({
          user: null,
          isAuth: false,
        }),

      deleteStore: () => {
        useAuthStore.persist.clearStorage();
      },

      setToken: (token: string) =>
        set({
          token,
        }),

      deleteToken: () =>
        set({
          token: null,
        }),
    }),
    {
      name: "placas-auth-999",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
