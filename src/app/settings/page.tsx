"use client";

import { User, Lock, ChevronRight, GlobeLock } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const settingsSections = [
    {
      id: "personal",
      title: "Personal Information",
      icon: User,
      href: "/settings/personal-information",
    },
    {
      id: "password",
      title: "Change password",
      icon: Lock,
      href: "/settings/change-password",
    },
    {
      id: "terms",
      title: "Privacy & Policy",
      icon: GlobeLock,
      href: "/settings/privacy-policy",
    },
  ];

  return (
    <div className='min-h-screen bg-transparent p-4 md:p-6'>
      <div className='mx-auto max-w-4xl'>
        <h1 className='text-2xl font-semibold text-gray-900 mb-6'>Setting</h1>

        <div className='space-y-2'>
          {settingsSections.map((section) => {
            const Icon = section?.icon;

            return (
              <div
                key={section.id}
                className='bg-white rounded-lg border border-gray-200 overflow-hidden'
              >
                <Link
                  href={section?.href}
                  className='w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors'
                >
                  <div className='flex items-center gap-3'>
                    <Icon className='h-5 w-5 text-gray-600' />
                    <span className='text-gray-900 font-medium'>
                      {section?.title}
                    </span>
                  </div>
                  <ChevronRight
                    className={`h-5 w-5 text-gray-400 transition-transform`}
                  />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
