"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Edit } from "lucide-react";
import { getImageURL } from "@/utils/getImageURL";
import { useAuth } from "@/hooks/useAuth";

export default function PersonalInformationPage() {
  const { user, profileLoading } = useAuth();

  if (profileLoading) {
    return (
      <div className='w-full min-h-[70vh] flex items-center justify-center text-black'>
        Loading ......
      </div>
    );
  }

  return (
    <div className='flex min-h-screen bg-[#FFFFFF]'>
      <div className='flex-1 w-full'>
        <main className='w-full p-4 md:p-6'>
          <div className=' mx-auto'>
            <div className='mb-6 flex items-center justify-between'>
              <Link
                href='/settings'
                className='inline-flex items-center text-primary hover:text-teal-700'
              >
                <ArrowLeft className='mr-2 h-6 w-6' />
                <span className='text-2xl font-semibold'>
                  Personal Information
                </span>
              </Link>
              <Link
                href='/settings/personal-information/edit'
                className='bg-primary text-white rounded-md px-4 py-2'
              >
                <button className='flex items-center gap-2'>
                  <Edit className='h-4 w-4' />
                  <span>Edit</span>
                </button>
              </Link>
            </div>

            <div className='bg-[#ffffff93] rounded-md p-6'>
              <div className='flex flex-col md:flex-row gap-8 mb-6'>
                {/* Profile Photo Section */}
                <div className='w-full md:w-64 flex flex-col items-center rounded-md px-6 py-10'>
                  <div className='w-32 h-32 rounded-full overflow-hidden relative mb-3 border-2 border-gray-600'>
                    <Image
                      src={`${getImageURL(user?.profile_pic)}`}
                      alt={user!.full_name}
                      fill
                      className='object-cover'
                    />
                  </div>
                  <span className='text-base text-primary'>Profile</span>
                  <span className='font-medium text-lg text-primary'>
                    {user!.full_name}
                  </span>
                </div>

                {/* User Information Section */}
                <div className='flex-1 space-y-6'>
                  <div className='flex flex-col gap-1'>
                    <div className='text-lg font-medium text-primary'>Name</div>
                    <div className='text-lg text-primary px-2 py-3 rounded-md border border-gray-500'>
                      {user?.full_name}
                    </div>
                  </div>

                  <div className='flex flex-col gap-1'>
                    <div className='text-lg font-medium text-primary'>
                      Email
                    </div>
                    <div className='text-lg text-primary px-2 py-3 rounded-md border border-gray-500'>
                      {user?.email}
                    </div>
                  </div>

                  <div className='flex flex-col gap-1'>
                    <div className='text-lg font-medium text-primary'>
                      Phone Number
                    </div>
                    <div className='text-lg text-primary px-2 py-3 rounded-md border border-gray-500'>
                      {user?.contanct_no
                        ? user?.contanct_no
                        : "No number set yet"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
