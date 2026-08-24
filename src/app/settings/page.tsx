"use client";

import {
  User,
  Lock,
  ChevronRight,
  GlobeLock,
  Handshake,
  FileTerminal,
  Settings,
} from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const settingsSections = [
    {
      id: "personal",
      title: "Personal Information",
      description: "Update your name, email, and profile details",
      icon: User,
      href: "/settings/personal-information",
      color: "from-[#FEAA39] to-[#d18e29]",
      iconBg: "bg-[#FEAA39]/10",
      iconColor: "text-[#FEAA39]",
    },
    {
      id: "password",
      title: "Change Password",
      description: "Update your password and security settings",
      icon: Lock,
      href: "/settings/change-password",
      color: "from-[#315D62] to-[#27484c]",
      iconBg: "bg-[#315D62]/10",
      iconColor: "text-[#315D62]",
    },
    {
      id: "privacy",
      title: "Privacy & Policy",
      description: "Review and manage privacy preferences",
      icon: GlobeLock,
      href: "/settings/privacy-policy",
      color: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      id: "terms",
      title: "Terms & Conditions",
      description: "Read the terms of service and usage policies",
      icon: FileTerminal,
      href: "/settings/terms-conditions",
      color: "from-violet-500 to-violet-600",
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      id: "trust",
      title: "Trust & Safety",
      description: "Manage safety settings and report issues",
      icon: Handshake,
      href: "/settings/trust-safety",
      color: "from-emerald-500 to-emerald-600",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
  ];

  return (
    <div className='min-h-screen bg-transparent p-4 md:p-6'>
      <div className='mx-auto max-w-4xl'>
        {/* Header */}
        <div className='flex items-center gap-3 mb-8'>
          <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#315D62] to-[#27484c] shadow-lg shadow-[#315D62]/20'>
            <Settings className='h-5 w-5 text-white' />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-gray-900 tracking-tight'>Settings</h1>
            <p className='text-sm text-gray-500'>Manage your account and preferences</p>
          </div>
        </div>

        {/* Settings List */}
        <div className='space-y-3'>
          {settingsSections.map((section) => {
            const Icon = section?.icon;

            return (
              <Link
                key={section.id}
                href={section?.href}
                className='group block'
              >
                <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-[#FEAA39]/20 transition-all duration-300'>
                  <div className='flex items-center justify-between p-5'>
                    <div className='flex items-center gap-4'>
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${section.iconBg} transition-all duration-300 group-hover:scale-105`}>
                        <Icon className={`h-5 w-5 ${section.iconColor}`} />
                      </div>
                      <div>
                        <span className='text-gray-900 font-semibold text-[15px] block'>
                          {section?.title}
                        </span>
                        <span className='text-xs text-gray-400 mt-0.5 block'>
                          {section?.description}
                        </span>
                      </div>
                    </div>
                    <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 group-hover:bg-[#FEAA39]/10 transition-all duration-200'>
                      <ChevronRight
                        className='h-4 w-4 text-gray-400 group-hover:text-[#FEAA39] group-hover:translate-x-0.5 transition-all duration-200'
                      />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
