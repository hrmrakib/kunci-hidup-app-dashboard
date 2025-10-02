"use client";

import { use, useEffect } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCreateSprialMutation,
  useGetSprialQuery,
} from "@/redux/features/sprial-management/sprialManagementAPI";
import { Skeleton } from "@/components/ui/skeleton";

interface DayData {
  id: number;
  enabled: boolean;
  journalPrompt: string;
  voiceFile: File | null;
}

export default function EditSpiralPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [spiralName, setSpiralName] = useState("Feminine Healing Spiral");
  const [spiralDetails, setSpiralDetails] = useState(
    "When you want to receive more, but you're afraid to open. This spiral helps you clear the blocks and fear of abundance."
  );
  const [focusPoint, setFocusPoint] = useState(
    "Self-worth, fear of receiving, overflow"
  );
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    focus_point: "",
    duration: "",
  });
  const [createSprialMutation] = useCreateSprialMutation();

  const [days, setDays] = useState<DayData[]>(
    Array.from({ length: 7 }, (_, i) => ({
      id: i + 1,
      enabled: i === 0 || i === 1 || i === 2 || i === 5 || i === 6, // Default enabled days
      journalPrompt:
        i < 3 || i === 5 || i === 6
          ? "Repeat repeatedly: I welcome receiving support, human witness, support. And forgive using light humor, gentle beneficial heal right."
          : "",
      voiceFile: null,
    }))
  );

  const { data: spiral, isLoading } = useGetSprialQuery(id);
  console.log(spiral?.data?.days);

  useEffect(() => {
    if (spiral) {
      setFormData({
        title: spiral?.data?.title,
        description: spiral?.data?.description,
        focus_point: spiral?.data?.focus_point,
        duration: spiral?.data?.duration,
      });
    }
  }, [spiral]);

  const handleCreateSpiral = async () => {
    const spiralData = {
      name: spiralName,
      details: spiralDetails,
      focusPoint: focusPoint,
      days: days.filter((day) => day.enabled),
    };
    const res = await createSprialMutation(spiralData);
    console.log(res);
  };

  const handleDayToggle = (dayId: number) => {
    setDays(
      days.map((day) =>
        day.id === dayId ? { ...day, enabled: !day.enabled } : day
      )
    );
  };

  const handleJournalPromptChange = (dayId: number, prompt: string) => {
    setDays(
      days.map((day) =>
        day.id === dayId ? { ...day, journalPrompt: prompt } : day
      )
    );
  };

  const handleVoiceUpload = (dayId: number, file: File | null) => {
    setDays(
      days.map((day) => (day.id === dayId ? { ...day, voiceFile: file } : day))
    );
  };

  const handleUpdate = () => {
    // Here you would typically update the data
    console.log("[v0] Updating spiral:", {
      id: params.id,
      spiralName,
      spiralDetails,
      focusPoint,
      days: days.filter((day) => day.enabled),
    });
    router.push("/journal-prompts");
  };

  const handleCancel = () => {
    router.push("/journal-prompts");
  };

  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-6 cursor-not-allowed'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='flex items-center gap-4 mb-8'>
          <Link
            href='/journal-prompts'
            className='flex items-center text-gray-900'
          >
            <Button variant='ghost' size='sm' onClick={() => router.back()}>
              <ArrowLeft className='w-4 h-4 mr-2' />
            </Button>
            Edit Spiral
          </Link>
        </div>

        {/* loading - skeleton */}
        {isLoading ? (
          <div className='space-y-6'>
            <Skeleton className='h-96 w-full mx-auto bg-gray-200' />
            <div className='flex flex-col md:flex-row items-center justify-center gap-7'>
              <Skeleton className='h-64 w-full bg-gray-200' />
              <Skeleton className='h-64 w-full bg-gray-200' />
            </div>
            <div className='flex flex-col md:flex-row items-center justify-center gap-7'>
              <Skeleton className='h-64 w-full bg-gray-200' />
              <Skeleton className='h-64 w-full bg-gray-200' />
            </div>
          </div>
        ) : (
          /* Form */
          <div className='space-y-6'>
            {/* Basic Info */}
            <Card>
              <CardContent className='p-6 space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Spiral Name:
                  </label>
                  <Input
                    placeholder='Enter spiral name'
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Spiral Details:
                  </label>
                  <Textarea
                    placeholder='Enter spiral details'
                    className='text-black border !border-gray-400'
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    rows={4}
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Focus point:
                  </label>
                  <Input
                    placeholder='Enter focus point'
                    value={formData.focus_point}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        focus_point: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Duration:
                  </label>
                  <Input
                    type='number'
                    placeholder='Enter duration in days'
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Days */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {days.map((day) => (
                <Card
                  key={day.id}
                  className={`${
                    day.enabled
                      ? "border-blue-200"
                      : "border-gray-200 opacity-60"
                  }`}
                >
                  <CardContent className='p-6'>
                    <div className='flex items-center justify-between mb-4'>
                      <h3 className='text-lg font-semibold'>Day {day.id}</h3>
                      <Switch
                        checked={day.enabled}
                        onCheckedChange={() => handleDayToggle(day.id)}
                      />
                    </div>

                    <div className='space-y-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Voice Title:
                        </label>
                        <Input
                          placeholder='Enter journal prompt'
                          value={day.journalPrompt}
                          onChange={(e) =>
                            handleJournalPromptChange(day.id, e.target.value)
                          }
                          disabled={!day.enabled}
                          className='!border border-gray-400'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Journal prompt:
                        </label>
                        <Textarea
                          placeholder='Enter journal prompt'
                          value={day.journalPrompt}
                          onChange={(e) =>
                            handleJournalPromptChange(day.id, e.target.value)
                          }
                          disabled={!day.enabled}
                          rows={3}
                          className='!border border-gray-400'
                        />
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Voice drop:
                        </label>
                        <div className='!w-full bg-[#F4F4F4] flex items-center gap-2'>
                          <Input
                            type='file'
                            accept='audio/*'
                            onChange={(e) =>
                              handleVoiceUpload(
                                day.id,
                                e.target.files?.[0] || null
                              )
                            }
                            disabled={!day.enabled}
                            className='hidden'
                            id={`voice-upload-${day.id}`}
                          />
                          <label
                            htmlFor={`voice-upload-${day.id}`}
                            className={`flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 ${
                              !day.enabled
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            <Upload className='w-4 h-4' />
                            <span className='text-sm'>
                              {day.voiceFile
                                ? day.voiceFile.name
                                : "Grief Ritual - Breathe Into Loss"}
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Action Buttons */}
            <div className='flex gap-4 justify-end pt-6'>
              <Button variant='outline' onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                className='bg-orange-500 hover:bg-orange-600 text-white'
                onClick={handleUpdate}
              >
                Update
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
