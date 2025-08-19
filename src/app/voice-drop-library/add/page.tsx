"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AddVoicePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    useCase: "",
    emotion: "",
    audioFile: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, audioFile: file }));
      if (errors.audioFile) {
        setErrors((prev) => ({ ...prev, audioFile: "" }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Voice title is required";
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    if (!formData.useCase) {
      newErrors.useCase = "Use case is required";
    }
    if (!formData.emotion.trim()) {
      newErrors.emotion = "Emotion is required";
    }
    if (!formData.audioFile) {
      newErrors.audioFile = "Audio file is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Here you would typically send the data to your API
      console.log("Form submitted:", formData);
      router.push("/voices");
    }
  };

  const handleCancel = () => {
    router.push("/voices");
  };

  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-6'>
      <div className='max-w-2xl mx-auto'>
        {/* Header */}
        <div className='flex items-center gap-4 mb-8'>
          <Link href='/voices'>
            <Button variant='ghost' size='sm' className='p-2'>
              <ArrowLeft className='w-4 h-4' />
            </Button>
          </Link>
          <h1 className='text-2xl font-semibold text-gray-900'>
            Add New Voice
          </h1>
        </div>

        {/* Form Card */}
        <div className='bg-white rounded-lg shadow-sm border p-6 md:p-8'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Voice Title */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Voice title:
              </label>
              <Input
                placeholder='Enter voice title'
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className='text-red-500 text-sm mt-1'>{errors.title}</p>
              )}
            </div>

            {/* Category and Use Case */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Category:
                </label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleInputChange("category", value)
                  }
                >
                  <SelectTrigger
                    className={errors.category ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder='Select category' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='spiral-journey'>
                      Spiral Journey
                    </SelectItem>
                    <SelectItem value='portal'>Portal</SelectItem>
                    <SelectItem value='journal'>Journal</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className='text-red-500 text-sm mt-1'>{errors.category}</p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Use Case:
                </label>
                <Select
                  value={formData.useCase}
                  onValueChange={(value) => handleInputChange("useCase", value)}
                >
                  <SelectTrigger
                    className={errors.useCase ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder='Select use case' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='comfort'>Comfort</SelectItem>
                    <SelectItem value='activation'>Activation</SelectItem>
                    <SelectItem value='reflection'>Reflection</SelectItem>
                  </SelectContent>
                </Select>
                {errors.useCase && (
                  <p className='text-red-500 text-sm mt-1'>{errors.useCase}</p>
                )}
              </div>
            </div>

            {/* Emotion */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Emotion:
              </label>
              <Input
                placeholder='Fear, Shame, Grief'
                value={formData.emotion}
                onChange={(e) => handleInputChange("emotion", e.target.value)}
                className={errors.emotion ? "border-red-500" : ""}
              />
              {errors.emotion && (
                <p className='text-red-500 text-sm mt-1'>{errors.emotion}</p>
              )}
            </div>

            {/* Voice Upload */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Voice Upload:
              </label>
              <div className='relative'>
                <input
                  type='file'
                  accept='audio/*'
                  onChange={handleFileUpload}
                  className='hidden'
                  id='audio-upload'
                />
                <label
                  htmlFor='audio-upload'
                  className={`flex items-center gap-3 p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                    errors.audioFile ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  {formData.audioFile ? (
                    <>
                      <div className='w-8 h-8 bg-gray-300 rounded flex items-center justify-center'>
                        <span className='text-xs font-medium'>📁</span>
                      </div>
                      <div className='flex-1'>
                        <div className='text-sm font-medium'>
                          {formData.audioFile.name}
                        </div>
                        <div className='text-xs text-gray-500'>0:00 - 2:30</div>
                      </div>
                      <div className='px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full'>
                        Uploaded
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload className='w-8 h-8 text-gray-400' />
                      <div className='text-sm text-gray-600'>
                        Click to upload audio file or drag and drop
                      </div>
                    </>
                  )}
                </label>
              </div>
              {errors.audioFile && (
                <p className='text-red-500 text-sm mt-1'>{errors.audioFile}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className='flex gap-4 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={handleCancel}
                className='flex-1 border-orange-300 text-orange-600 hover:bg-orange-50 bg-transparent'
              >
                Cancel
              </Button>
              <Button
                type='submit'
                className='flex-1 bg-orange-500 hover:bg-orange-600 text-white'
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
