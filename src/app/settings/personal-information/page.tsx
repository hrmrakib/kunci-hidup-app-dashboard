"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Edit } from "lucide-react";
import { useGetAdminProfileQuery } from "../../../redux/features/setting/settingAPI";

export default function PersonalInformationPage() {
  const { data: admin } = useGetAdminProfileQuery({});

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
                <div className='w-full md:w-64 flex flex-col items-center border border-gray-600 rounded-md px-6 py-10'>
                  <div className='w-32 h-32 rounded-full overflow-hidden relative mb-3'>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}${admin?.data?.profile_pic}`}
                      alt={admin?.data?.full_name}
                      fill
                      className='object-cover'
                    />
                  </div>
                  <span className='text-base text-primary'>Profile</span>
                  <span className='font-medium text-lg text-primary'>
                    Admin
                  </span>
                </div>

                {/* User Information Section */}
                <div className='flex-1 space-y-6'>
                  <div className='flex flex-col gap-1'>
                    <div className='text-lg font-medium text-primary'>Name</div>
                    <div className='text-lg text-primary px-2 py-3 rounded-md border border-gray-500'>
                      {admin?.data?.full_name}
                    </div>
                  </div>

                  <div className='flex flex-col gap-1'>
                    <div className='text-lg font-medium text-primary'>
                      Email
                    </div>
                    <div className='text-lg text-primary px-2 py-3 rounded-md border border-gray-500'>
                      {admin?.data?.email}
                    </div>
                  </div>

                  <div className='flex flex-col gap-1'>
                    <div className='text-lg font-medium text-primary'>
                      Phone Number
                    </div>
                    <div className='text-lg text-primary px-2 py-3 rounded-md border border-gray-500'>
                      {admin?.data?.contanct_no
                        ? admin?.data?.contanct_no
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
