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
import { ArrowLeft, Upload, Volume2, Music, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCreateVoiceLibraryMutation } from "@/redux/features/voice-library/voiceLibraryAPI";
import { toast } from "sonner";

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
  const [createVoiceLibrary, { isLoading }] = useCreateVoiceLibraryMutation();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const formDataWithAudio = new FormData();

      formDataWithAudio.append("title", formData.title);
      formDataWithAudio.append("category", formData.category);
      formDataWithAudio.append("use_case", formData.useCase);
      formDataWithAudio.append("emotion", formData.emotion);

      const audioFile = formData.audioFile as File;

      if (audioFile) {
        formDataWithAudio.append("file", audioFile);
      }

      const res = await createVoiceLibrary(formDataWithAudio);

      if (res?.data?.success) {
        toast.success("Voice added successfully!");
        router.push("/voice-drop-library");
      }

      // Here you would typically send the data to your API
      console.log("Form submitted:", res);

      // router.push("/voices");
    }
  };

  const handleCancel = () => {
    router.push("/voice-drop-library");
  };

  return (
    <div className='min-h-screen bg-transparent p-4 md:p-6'>
      <div className='max-w-2xl mx-auto'>
        {/* Header */}
        <div className='flex items-center gap-4 mb-8'>
          <Link href='/voice-drop-library'>
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
              <Volume2 className='h-5 w-5 text-white' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-gray-900 tracking-tight'>
                Add New Voice
              </h1>
              <p className='text-sm text-gray-500'>Upload and configure a new voice drop</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Voice Title */}
            <div className='space-y-1.5'>
              <label className='block text-sm font-medium text-gray-700'>
                Voice Title
              </label>
              <Input
                placeholder='Enter voice title'
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className={`h-11 rounded-xl bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-[#FEAA39] focus:ring-[#FEAA39]/20 transition-all duration-200 ${errors.title ? "!border-red-400 !ring-red-100" : ""}`}
              />
              {errors.title && (
                <p className='text-red-500 text-xs mt-1 flex items-center gap-1'>
                  <span className='inline-block w-1 h-1 rounded-full bg-red-500' />
                  {errors.title}
                </p>
              )}
            </div>

            {/* Category and Use Case */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              <div className='space-y-1.5'>
                <label className='block text-sm font-medium text-gray-700'>
                  Category
                </label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleInputChange("category", value)
                  }
                >
                  <SelectTrigger
                    className={`h-11 rounded-xl bg-gray-50 border-gray-200 text-gray-800 focus:border-[#FEAA39] focus:ring-[#FEAA39]/20 transition-all duration-200 ${
                      errors.category ? "!border-red-400 !ring-red-100" : ""
                    }`}
                  >
                    <SelectValue
                      placeholder='Select category'
                    />
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
                  <p className='text-red-500 text-xs mt-1 flex items-center gap-1'>
                    <span className='inline-block w-1 h-1 rounded-full bg-red-500' />
                    {errors.category}
                  </p>
                )}
              </div>

              <div className='space-y-1.5'>
                <label className='block text-sm font-medium text-gray-700'>
                  Use Case
                </label>
                <Select
                  value={formData.useCase}
                  onValueChange={(value) => handleInputChange("useCase", value)}
                >
                  <SelectTrigger
                    className={`h-11 rounded-xl bg-gray-50 border-gray-200 text-gray-800 focus:border-[#FEAA39] focus:ring-[#FEAA39]/20 transition-all duration-200 ${
                      errors.useCase ? "!border-red-400 !ring-red-100" : ""
                    }`}
                  >
                    <SelectValue
                      placeholder='Select use case'
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='comfort'>Comfort</SelectItem>
                    <SelectItem value='activation'>Activation</SelectItem>
                    <SelectItem value='reflection'>Reflection</SelectItem>
                  </SelectContent>
                </Select>
                {errors.useCase && (
                  <p className='text-red-500 text-xs mt-1 flex items-center gap-1'>
                    <span className='inline-block w-1 h-1 rounded-full bg-red-500' />
                    {errors.useCase}
                  </p>
                )}
              </div>
            </div>

            {/* Emotion */}
            <div className='space-y-1.5'>
              <label className='block text-sm font-medium text-gray-700'>
                Emotion
              </label>
              <Input
                placeholder='Fear, Shame, Grief'
                value={formData.emotion}
                onChange={(e) => handleInputChange("emotion", e.target.value)}
                className={`h-11 rounded-xl bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-[#FEAA39] focus:ring-[#FEAA39]/20 transition-all duration-200 ${errors.emotion ? "!border-red-400 !ring-red-100" : ""}`}
              />
              {errors.emotion && (
                <p className='text-red-500 text-xs mt-1 flex items-center gap-1'>
                  <span className='inline-block w-1 h-1 rounded-full bg-red-500' />
                  {errors.emotion}
                </p>
              )}
            </div>

            {/* Voice Upload */}
            <div className='space-y-1.5'>
              <label className='block text-sm font-medium text-gray-700'>
                Voice Upload
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
                  className={`flex items-center gap-4 p-5 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ${
                    formData.audioFile
                      ? "border-emerald-300 bg-emerald-50/50 hover:bg-emerald-50"
                      : errors.audioFile
                        ? "border-red-300 bg-red-50/30 hover:bg-red-50/50"
                        : "border-gray-200 bg-gray-50/50 hover:bg-[#FFF7EB] hover:border-[#FEAA39]/40"
                  }`}
                >
                  {formData.audioFile ? (
                    <>
                      <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100'>
                        <Music className='w-5 h-5 text-emerald-600' />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='text-sm font-semibold text-gray-800 truncate'>
                          {formData.audioFile.name}
                        </div>
                        <div className='text-xs text-gray-400 mt-0.5'>
                          {(formData.audioFile.size / (1024 * 1024)).toFixed(2)} MB
                        </div>
                      </div>
                      <div className='flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full shrink-0'>
                        <CheckCircle2 className='w-3.5 h-3.5' />
                        Uploaded
                      </div>
                    </>
                  ) : (
                    <>
                      <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100'>
                        <Upload className='w-5 h-5 text-gray-400' />
                      </div>
                      <div>
                        <div className='text-sm font-medium text-gray-600'>
                          Click to upload audio file
                        </div>
                        <div className='text-xs text-gray-400 mt-0.5'>
                          MP3, WAV, OGG up to 50MB
                        </div>
                      </div>
                    </>
                  )}
                </label>
              </div>
              {errors.audioFile && (
                <p className='text-red-500 text-xs mt-1 flex items-center gap-1'>
                  <span className='inline-block w-1 h-1 rounded-full bg-red-500' />
                  {errors.audioFile}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className='flex gap-3 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={handleCancel}
                className='flex-1 h-11 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50 font-medium cursor-pointer transition-all duration-200'
              >
                Cancel
              </Button>
              <Button
                disabled={isLoading}
                type='submit'
                className='flex-1 h-11 rounded-xl bg-gradient-to-r from-[#FEAA39] to-[#e09530] hover:from-[#e09530] hover:to-[#d18e29] text-white font-medium cursor-pointer shadow-md shadow-[#FEAA39]/20 transition-all duration-200'
              >
                {isLoading ? "Submitting..." : "Submit Voice"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
