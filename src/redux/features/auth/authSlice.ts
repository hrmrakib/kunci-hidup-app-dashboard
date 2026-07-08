/* eslint-disable @typescript-eslint/no-explicit-any */
import { Role } from "@/config/Role";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Exactly matches the backend response object from your "data" key
export type TUser = {
  user_id: number;
  email: string;
  full_name: string;
  username: string | null;
  role?: Role | null;
  profile_pic: string;
  profile_pic_url: string | null;
  contanct_no: string | null; // Keeps the typo from your backend API
  country: string | null;
  is_verified: boolean;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  is_subscribed: boolean;
  created_at: string;
  updated_at: string;
};

type TAuthState = {
  userToggle: boolean;
  user: TUser | null;
  access: string | null;
  refresh: string | null;
  profileLoading?: boolean;
};

const initialState: TAuthState = {
  userToggle: false,
  user: null,
  access: null,
  refresh: null,
  profileLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userTrack: (state) => {
      state.userToggle = !state.userToggle;
    },

    setUser: (
      state,
      action: PayloadAction<{
        user: TUser;
        access?: string | null;
        refresh?: string | null;
      }>,
    ) => {
      const { user, access, refresh } = action.payload;
      state.user = user;
      if (access !== undefined) state.access = access;
      if (refresh !== undefined) state.refresh = refresh;
      state.profileLoading = false;
    },

    logout: (state) => {
      state.user = null;
      state.access = null;
      state.refresh = null;
      state.profileLoading = false;

      // Safe check for Next.js Environment (SSR)
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
    },

    setProfileLoading: (state, action: PayloadAction<boolean>) => {
      state.profileLoading = action.payload;
    },
  },
});

export const { userTrack, setUser, logout, setProfileLoading } =
  authSlice.actions;

export default authSlice.reducer;
