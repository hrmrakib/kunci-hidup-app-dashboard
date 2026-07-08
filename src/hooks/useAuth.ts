import { RootState } from "@/redux/store/store";
import { useSelector } from "react-redux";

export function useAuth() {
  // Select the auth slice directly for cleaner access
  const { user, access, profileLoading } = useSelector(
    (state: RootState) => state.auth,
  );

  return {
    user,
    access,
    profileLoading,

    isLoggedIn: !!user && !!access,

    isVerified: user?.is_verified ?? false,

    isAdmin: user?.role === "admin",
  };
}
