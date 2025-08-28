"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface FormData {
  prompt: string;
  category: string;
  useCase: string;
  emotion: string;
  activationStatus: string;
}

export default function AddJournalPromptPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    prompt: "",
    category: "",
    useCase: "",
    emotion: "",
    activationStatus: "Active",
  });

  const categories = [
    "Spiral Journey",
    "Shadow Work",
    "Inner Child",
    "Manifestation",
    "Gratitude",
  ];
  const useCases = [
    "Self-reflection",
    "Comfort",
    "Activation",
    "Healing",
    "Growth",
  ];
  const emotions = ["Shame", "Fear", "Grief", "Joy", "Anger", "Love", "Peace"];
  const statuses = ["Active", "Inactive"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.prompt.trim() ||
      !formData.category ||
      !formData.useCase ||
      !formData.emotion
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Here you would typically send the data to your backend
    console.log("Creating new journal prompt:", formData);

    // Redirect back to the main page
    router.push("/journal-prompt-manager");
  };

  const handleCancel = () => {
    router.push("/journal-pro-manager");
  };

  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-6'>
      <div className='mx-auto max-w-2xl'>
        {/* Header */}
        <div className='mb-6 flex items-center gap-3'>
          <Link href='/journal-pro-manager'>
            <Button variant='ghost' size='sm' className='p-2'>
              <ArrowLeft className='h-4 w-4 text-black' />
            </Button>
          </Link>
          <h1 className='text-xl font-semibold text-gray-900'>
            Add New Journal Prompt
          </h1>
        </div>

        {/* Form */}
        <Card className='border-2 border-orange-200 bg-white'>
          <CardContent className='p-6'>
            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Journal Prompt */}
              <div>
                <label className='block text-base font-medium text-[#000000] mb-2'>
                  Journal Prompt :
                </label>
                <Textarea
                  placeholder='Enter Prompt'
                  value={formData.prompt}
                  onChange={(e) =>
                    setFormData({ ...formData, prompt: e.target.value })
                  }
                  className='min-h-[120px] resize-none !bg-[#F4F4F4] border border-gray-300'
                  required
                />
              </div>

              {/* Category and Use Case */}
              <div className='flex items-center justify-between gap-4'>
                <div className='w-1/2'>
                  <label className='block text-base font-medium text-[#000000] mb-2'>
                    Category:
                  </label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select' />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='w-1/2'>
                  <label className='block text-base font-medium text-[#000000] mb-2'>
                    Use Case:
                  </label>
                  <Select
                    value={formData.useCase}
                    onValueChange={(value) =>
                      setFormData({ ...formData, useCase: value })
                    }
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select' />
                    </SelectTrigger>
                    <SelectContent>
                      {useCases.map((useCase) => (
                        <SelectItem key={useCase} value={useCase}>
                          {useCase}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Emotion and Activation Status */}
              <div className='flex items-center justify-between gap-4'>
                <div className='w-1/2'>
                  <label className='block text-base font-medium text-[#000000] mb-2'>
                    Emotion:
                  </label>
                  <Select
                    value={formData.emotion}
                    onValueChange={(value) =>
                      setFormData({ ...formData, emotion: value })
                    }
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select' />
                    </SelectTrigger>
                    <SelectContent>
                      {emotions.map((emotion) => (
                        <SelectItem key={emotion} value={emotion}>
                          {emotion}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='w-1/2'>
                  <label className='block text-base font-medium text-[#000000] mb-2'>
                    Activation Status:
                  </label>
                  <Select
                    value={formData.activationStatus}
                    onValueChange={(value) =>
                      setFormData({ ...formData, activationStatus: value })
                    }
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          <span
                            className={
                              status === "Active"
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {status}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Buttons */}
              <div className='flex gap-3 pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={handleCancel}
                  className='flex-1 !border-[#FEAA39] !text-[#FEAA39] hover:bg-orange-50 bg-transparent cursor-pointer'
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  className='flex-1 bg-[#FEAA39] hover:bg-[#FEAA39] text-white cursor-pointer'
                >
                  Submit
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
