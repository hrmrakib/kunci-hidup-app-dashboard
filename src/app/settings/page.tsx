"use client";

import { useState } from "react";
import { ChevronDown, User, Lock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SettingsPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

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
      title: "Terms & Conditions",
      icon: FileText,
      href: "/settings/terms-conditions",
    },
  ];

  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-6'>
      <div className='mx-auto max-w-4xl'>
        <h1 className='text-2xl font-semibold text-gray-900 mb-6'>Setting</h1>

        <div className='space-y-2'>
          {settingsSections.map((section) => {
            const Icon = section.icon;
            const isExpanded = expandedSection === section.id;

            return (
              <div
                key={section.id}
                className='bg-white rounded-lg border border-gray-200 overflow-hidden'
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className='w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors'
                >
                  <div className='flex items-center gap-3'>
                    <Icon className='h-5 w-5 text-gray-600' />
                    <span className='text-gray-900 font-medium'>
                      {section.title}
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-400 transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isExpanded && (
                  <div className='px-4 pb-4 border-t border-gray-100'>
                    <div className='pt-4'>
                      <Link href={section.href}>
                        <Button
                          variant='outline'
                          className='w-full sm:w-auto bg-transparent text-black'
                        >
                          Manage {section.title}
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
