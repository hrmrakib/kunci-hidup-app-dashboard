"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { useGetAdminProfileQuery } from "@/redux/features/setting/settingAPI";
import { setProfileLoading, setUser } from "@/redux/features/auth/authSlice";

export default function AppInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const { data, isLoading } = useGetAdminProfileQuery({}, { skip: !token });

  useEffect(() => {
    if (!token) {
      dispatch(setProfileLoading(false));
      return;
    }

    dispatch(setProfileLoading(isLoading));
  }, [isLoading, token, dispatch]);

  useEffect(() => {
    if (data?.data) {
      dispatch(
        setUser({
          user: data.data,
          access: data.access_token || token,
          refresh: data.refresh_token,
        }),
      );
    }
  }, [data, token, dispatch]);

  return children;
}
