"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function TermsConditionsPage() {
  const router = useRouter();

  const handleEdit = () => {
    router.push("/settings/terms-conditions/edit");
  };

  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-6'>
      <div className='mx-auto max-w-4xl'>
        {/* Header */}
        <div className='mb-6 flex items-center gap-4'>
          <button
            onClick={() => router.back()}
            className='flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors'
          >
            <ArrowLeft className='h-5 w-5' />
            <span className='text-lg font-medium'>Terms & conditions</span>
          </button>
        </div>

        {/* Content */}
        <div className='bg-white rounded-lg shadow-sm p-6 md:p-8'>
          <h1 className='text-2xl md:text-3xl font-bold text-gray-900 mb-8'>
            Terms & Conditions
          </h1>

          <div className='prose prose-gray max-w-none'>
            <p className='text-gray-700 leading-relaxed mb-6'>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry&apos;s standard dummy
              text ever since the 1500s, when an unknown printer took a galley
              of type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and
              typesetting industry. Lorem Ipsum has been the industry&apos;s
              standard dummy text ever since the 1500s, when an unknown printer
              took a galley of type and scrambled it to make a type specimen
              book. It has survived not only five centuries.
            </p>

            <p className='text-gray-700 leading-relaxed mb-8'>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry&apos;s standard dummy
              text ever since the 1500s, when an unknown printer took a galley
              of type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and
              typesetting industry. Lorem Ipsum has been the industry&apos;s
              standard dummy text ever since the 1500s, when an unknown printer
              took a galley of type and scrambled it to make a type specimen
              book. It has survived not only five centuries.
            </p>
          </div>

          {/* Edit Button */}
          <div className='flex justify-end mt-8'>
            <Button
              onClick={handleEdit}
              className='bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 rounded-lg font-medium transition-colors'
            >
              Edit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
