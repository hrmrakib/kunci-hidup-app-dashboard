"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import {
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
} from "@/redux/features/setting/settingAPI";

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

  const { data: admin } = useGetAdminProfileQuery({});

  const [updateProfile] = useUpdateAdminProfileMutation();

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

    const formDataToSubmit = new FormData();

    formDataToSubmit.append("full_name", formData.name);
    formDataToSubmit.append("email", formData.email);

    if (profileImage instanceof File) {
      formDataToSubmit.append("profile_pic", profileImage);
    }

    const res = await updateProfile(formDataToSubmit);

    if (res?.data?.success) {
      router.push("/settings/personal-information");
    }
  };

  return (
    <div className='flex min-h-screen bg-transparent'>
      <div className='flex-1 w-full'>
        <main className='bg-transparent w-full p-4 md:p-6'>
          <div className='mx-auto'>
            <div className='mb-6'>
              <Link
                href='/settings/personal-information'
                className='inline-flex items-center text-primary hover:text-teal-700'
              >
                <ArrowLeft className='mr-2 h-6 w-6' />
                <span className='text-2xl font-semibold'>
                  Personal Information Edit
                </span>
              </Link>
            </div>

            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='flex flex-col md:flex-row gap-8'>
                {/* Profile Image Section */}
                <div className='w-full md:w-64 flex flex-col items-center border border-gray-600 rounded-md p-6'>
                  <div
                    className='relative mb-4 cursor-pointer'
                    onClick={handleImageClick}
                  >
                    <div className='w-32 h-32 rounded-full overflow-hidden relative'>
                      {imagePreview ? (
                        <Image
                          src={imagePreview}
                          alt='Profile'
                          fill
                          className='object-cover'
                          sizes='128px'
                        />
                      ) : (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL}${admin?.data?.profile_pic}`}
                          alt='Profile'
                          fill
                          className='object-cover'
                          sizes='128px'
                        />
                      )}
                    </div>
                    <div className='absolute bottom-0 right-0 bg-white p-1 rounded-full border border-gray-200'>
                      <Camera className='h-5 w-5 text-gray-600' />
                    </div>
                    <input
                      type='file'
                      ref={fileInputRef}
                      className='hidden'
                      accept='image/*'
                      onChange={handleImageChange}
                    />
                  </div>
                  <span className='text-sm text-gray-600'>Profile</span>
                  <span className='font-medium text-gray-800'>
                    {formData.name || "Admin"}
                  </span>
                </div>

                {/* Form Fields Section */}
                <div className='flex-1 space-y-4'>
                  <div className='space-y-2'>
                    <Label
                      htmlFor='name'
                      className='text-lg font-medium text-primary'
                    >
                      Name
                    </Label>
                    <Input
                      id='name'
                      name='name'
                      value={formData.name}
                      onChange={handleChange}
                      className='w-full text-lg text-primary'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label
                      htmlFor='email'
                      className='text-lg font-medium text-primary'
                    >
                      Email
                    </Label>
                    <Input
                      id='email'
                      name='email'
                      type='email'
                      value={formData.email}
                      onChange={handleChange}
                      className='w-full text-lg text-primary'
                    />
                  </div>

                  <div className='space-y-2'>
                    {/* <Label
                      htmlFor='phone'
                      className='text-lg font-medium text-primary'
                    >
                      Phone Number
                    </Label> */}
                    {/* <PhoneInput
                      country={"us"}
                      value={formData.phone}
                      onChange={(phone) => setFormData({ ...formData, phone })}
                      containerClass='w-full'
                      inputClass='w-full h-[100px] p-2 border border-[#760C2A] rounded-md text-5xl font-semibold text-[#760C2A]'
                      buttonClass='border-[#760C2A]'
                      inputStyle={{
                        width: "100%",
                        height: "40px",
                        border: "1px solid #760C2A",
                      }}
                      placeholder='Enter phone number'
                    /> */}
                  </div>
                </div>
              </div>

              <div className='flex justify-end'>
                <Button type='submit' className='bg-primary hover:bg-teal-700'>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
