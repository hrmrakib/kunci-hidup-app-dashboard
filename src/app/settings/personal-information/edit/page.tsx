"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Camera, User, Mail, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
} from "@/redux/features/setting/settingAPI";
import { toast } from "sonner";
import { getImageURL } from "@/utils/getImageURL";

export default function PersonalInformationEditPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [profileImage, setProfileImage] = useState<File | string>("/admin.jpg");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { data: admin, isLoading: profileLoading } = useGetAdminProfileQuery({});

  const [updateProfile, { isLoading: isUpdating }] = useUpdateAdminProfileMutation();

  useEffect(() => {
    if (admin?.data) {
      setFormData({
        name: admin?.data?.full_name || "",
        email: admin?.data?.email || "",
        phone: admin?.data?.contact_no || "",
      });
      setProfileImage(admin?.data?.profile_pic || "/admin.jpeg");
    }
  }, [admin?.data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formDataToSubmit = new FormData();

      formDataToSubmit.append("full_name", formData.name);
      formDataToSubmit.append("email", formData.email);

      if (profileImage instanceof File) {
        formDataToSubmit.append("profile_pic", profileImage);
      }

      const res = await updateProfile(formDataToSubmit);

      if (res?.data?.success) {
        toast.success("Profile updated successfully!");
        router.push("/settings/personal-information");
      }
    } catch {
      toast.error("Profile update failed!");
    }
  };

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
        <div className='flex items-center gap-4 mb-8'>
          <Link href='/settings/personal-information'>
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
              <UserCog className='h-5 w-5 text-white' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-gray-900 tracking-tight'>
                Edit Profile
              </h1>
              <p className='text-sm text-gray-500'>Update your personal details and photo</p>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
          <form onSubmit={handleSubmit} className='flex flex-col md:flex-row'>
            {/* Left Column: Photo Upload */}
            <div className='w-full md:w-80 p-8 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col items-center justify-center bg-gray-50/50'>
              <div
                className='relative group cursor-pointer'
                onClick={handleImageClick}
              >
                <div className='absolute -inset-0.5 bg-gradient-to-br from-[#FEAA39] to-[#315D62] rounded-full opacity-0 blur-sm group-hover:opacity-60 transition duration-500'></div>
                <div className='relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white'>
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt='Profile Preview'
                      fill
                      className='object-cover'
                      sizes='160px'
                    />
                  ) : (
                    <Image
                      src={getImageURL(admin?.data?.profile_pic)}
                      alt={admin?.data?.full_name || 'Profile'}
                      fill
                      className='object-cover'
                      sizes='160px'
                    />
                  )}
                  {/* Hover Overlay */}
                  <div className='absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    <Camera className='w-8 h-8 text-white' />
                  </div>
                </div>
                {/* Fixed Camera Icon Badge */}
                <div className='absolute bottom-1 right-3 h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100 text-[#315D62] group-hover:text-[#FEAA39] transition-colors duration-200'>
                  <Camera className='h-5 w-5' />
                </div>
                <input
                  type='file'
                  ref={fileInputRef}
                  className='hidden'
                  accept='image/*'
                  onChange={handleImageChange}
                />
              </div>
              <div className='mt-6 text-center'>
                <h3 className='text-sm font-semibold text-gray-900'>Profile Photo</h3>
                <p className='text-xs text-gray-500 mt-1'>Click to upload new photo</p>
              </div>
            </div>

            {/* Right Column: Form Fields */}
            <div className='flex-1 p-8 space-y-6'>
              <div className='grid gap-6'>
                {/* Name */}
                <div className='space-y-2'>
                  <label htmlFor='name' className='flex items-center gap-2 text-sm font-semibold text-gray-700'>
                    <User className='w-4 h-4 text-gray-400' />
                    Full Name
                  </label>
                  <Input
                    id='name'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className='h-12 rounded-xl bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#FEAA39] focus:ring-[#FEAA39]/20 transition-all duration-200'
                  />
                </div>

                {/* Email */}
                <div className='space-y-2'>
                  <label htmlFor='email' className='flex items-center gap-2 text-sm font-semibold text-gray-700'>
                    <Mail className='w-4 h-4 text-gray-400' />
                    Email Address
                  </label>
                  <Input
                    id='email'
                    name='email'
                    type='email'
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className='h-12 rounded-xl bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#FEAA39] focus:ring-[#FEAA39]/20 transition-all duration-200'
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex gap-3 pt-6 border-t border-gray-100'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => router.push('/settings/personal-information')}
                  className='flex-1 h-12 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50 font-medium transition-all duration-200'
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  disabled={isUpdating}
                  className='flex-1 h-12 rounded-xl bg-gradient-to-r from-[#315D62] to-[#27484c] hover:from-[#27484c] hover:to-[#1f3a3d] text-white font-medium shadow-md shadow-[#315D62]/20 transition-all duration-200'
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
