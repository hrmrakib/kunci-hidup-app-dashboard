"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Edit, User, Mail, ShieldCheck } from "lucide-react";
import { getImageURL } from "@/utils/getImageURL";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function PersonalInformationPage() {
  const { user, profileLoading } = useAuth();

  if (profileLoading) {
    return (
      <div className='w-full min-h-[70vh] flex items-center justify-center text-gray-500'>
        <div className='flex flex-col items-center gap-3'>
          <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-[#FEAA39]'></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen bg-transparent p-4 md:p-6'>
      <div className='mx-auto max-w-4xl w-full'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <div className='flex items-center gap-4'>
            <Link href='/settings'>
              <Button
                variant='ghost'
                size='sm'
                className='h-10 w-10 p-0 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-200'
              >
                <ArrowLeft className='w-5 h-5 text-gray-600' />
              </Button>
            </Link>
            <div className='flex items-center gap-3'>
              <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#FEAA39] to-[#d18e29] shadow-lg shadow-[#FEAA39]/20'>
                <User className='h-5 w-5 text-white' />
              </div>
              <div>
                <h1 className='text-2xl font-bold text-gray-900 tracking-tight'>
                  Personal Information
                </h1>
                <p className='text-sm text-gray-500'>Manage your profile details</p>
              </div>
            </div>
          </div>
          <Link href='/settings/personal-information/edit'>
            <Button className='bg-gradient-to-r from-[#315D62] to-[#27484c] hover:from-[#27484c] hover:to-[#1f3a3d] text-white font-medium rounded-xl shadow-md shadow-[#315D62]/20 h-11 px-5 transition-all duration-200'>
              <Edit className='h-4 w-4 mr-2' />
              Edit Profile
            </Button>
          </Link>
        </div>

        {/* Content Card */}
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
          <div className='flex flex-col md:flex-row'>
            {/* Left Column: Photo */}
            <div className='w-full md:w-80 p-8 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col items-center justify-center bg-gray-50/50'>
              <div className='relative group'>
                <div className='absolute -inset-0.5 bg-gradient-to-br from-[#FEAA39] to-[#315D62] rounded-full opacity-50 blur-sm group-hover:opacity-75 transition duration-500'></div>
                <div className='relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white'>
                  <Image
                    src={getImageURL(user?.profile_pic)}
                    alt={user?.full_name || 'Profile Picture'}
                    fill
                    className='object-cover'
                  />
                </div>
              </div>
              <div className='mt-6 text-center'>
                <h2 className='text-xl font-bold text-gray-900'>{user?.full_name}</h2>
                <div className='inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-[#315D62]/10 text-[#315D62] text-xs font-semibold uppercase tracking-wide'>
                  <ShieldCheck className='w-3.5 h-3.5' />
                  {user?.role || 'User'}
                </div>
              </div>
            </div>

            {/* Right Column: Details */}
            <div className='flex-1 p-8 space-y-6'>
              <div className='grid gap-6'>
                {/* Name */}
                <div className='space-y-2'>
                  <div className='flex items-center gap-2 text-sm font-semibold text-gray-500'>
                    <User className='w-4 h-4' />
                    Full Name
                  </div>
                  <div className='h-12 flex items-center px-4 rounded-xl bg-gray-50 border border-gray-100 text-gray-900 font-medium'>
                    {user?.full_name || '—'}
                  </div>
                </div>

                {/* Email */}
                <div className='space-y-2'>
                  <div className='flex items-center gap-2 text-sm font-semibold text-gray-500'>
                    <Mail className='w-4 h-4' />
                    Email Address
                  </div>
                  <div className='h-12 flex items-center px-4 rounded-xl bg-gray-50 border border-gray-100 text-gray-900 font-medium'>
                    {user?.email || '—'}
                  </div>
                </div>  
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
