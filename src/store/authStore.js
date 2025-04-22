import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,

      // Creator Login (email & password)
      creatorLogin: async (email, password) => {
        try {
          const response = await axios.post("http://localhost:4000/api/v1/auth/creatorLogin", { email, password }, { withCredentials: true });

          if (response.data.success) {
            set({
              user: response.data.user,
              token: response.data.token,
              role: "creator",
              isAuthenticated: true,
            });
            return { success: true };
          } else {
            return { success: false, message: response.data.message };
          }
        } catch (error) {
          return { success: false, message: error.response?.data?.message || "Login failed" };
        }
      },

      // Panelist Login (email & hackathonID)
      panelistLogin: async (email, hackathonID) => {
        try {
          const response = await axios.post("http://localhost:4000/api/v1/auth/panelistLogin", { email, hackathonID }, { withCredentials: true });

          if (response.data.success) {
            const panelist = response.data.panelist;
            set({
              user: panelist,
              token: response.data.token,
              role: "panelist",
              isAuthenticated: true,
            });
            return { success: true, panelistId: panelist.id }; // Use .id instead of ._id
          } else {
            return { success: false, message: response.data.message };
          }
        } catch (error) {
          return { success: false, message: error.response?.data?.message || "Login failed" };
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          role: null,
          isAuthenticated: false,
        });
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      },
    }),
    { name: "auth-storage" }
  )
);

export default useAuthStore;