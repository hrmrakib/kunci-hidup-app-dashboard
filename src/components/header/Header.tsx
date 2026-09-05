"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getImageURL } from "@/utils/getImageURL";

const Header = () => {
  const { user } = useAuth();

  const pathname = usePathname();

  if (
    pathname === "/signup" ||
    pathname === "/signin" ||
    pathname === "/forgot-password" ||
    pathname === "/verify-password" ||
    pathname === "/verify-account" ||
    pathname === "/reset-password"
  ) {
    return null;
  }
  return (
    <div className='bg-white border-b border-gray-200'>
      <div className='max-w-8xl mx-auto px-6'>
        <div className='flex items-center justify-between py-6'>
          <div>
            <h1 className='md:text-2xl font-bold text-gray-900'>
              Welcome, {user?.full_name}
            </h1>
            <p className='text-sm md:text-base text-gray-600 mt-1'>
              Have a nice day
            </p>
          </div>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-3'>
              <Avatar className='h-10 w-10'>
                <AvatarImage src={getImageURL(user?.profile_pic)} alt={user?.full_name || 'Profile'} />
                <AvatarFallback>{user?.full_name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className='hidden sm:block'>
                <p className='text-base font-medium text-[#333338]'>
                  {user?.full_name}
                </p>
                <p className='text-sm text-[#606060] uppercase'>{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
