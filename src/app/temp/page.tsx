/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

import {
  useGetSprialQuery,
  useUpdateSpiralDayMutation,
} from "@/redux/features/sprial-management/sprialManagementAPI";

interface DayData {
  id: number | null;
  day_number: number;
  enabled: boolean;
  journalPrompt: string;
  voiceTitle: string;
  voiceFile: File | null;
  voiceDrop: string | null;
}

export default function EditSpiralPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const { data: spiral, isLoading } = useGetSprialQuery(id);
  const [updateDay] = useUpdateSpiralDayMutation();

  const [days, setDays] = useState<DayData[]>(
    Array.from({ length: 7 }, (_, i) => ({
      id: null,
      day_number: i + 1,
      enabled: false,
      journalPrompt: "",
      voiceTitle: "",
      voiceFile: null,
      voiceDrop: null,
    }))
  );

  // ✅ Load spiral days from API
  useEffect(() => {
    if (spiral?.data?.days?.length) {
      setDays((prevDays) =>
        prevDays.map((day) => {
          const apiDay = spiral.data.days.find(
            (d: any) => d.day_number === day.day_number
          );
          if (apiDay) {
            return {
              id: apiDay.id,
              day_number: apiDay.day_number,
              enabled: true,
              journalPrompt: apiDay.journal_prompt || "",
              voiceTitle: apiDay.voice_title || "",
              voiceFile: null,
              voiceDrop: apiDay.voice_drop || null,
            };
          }
          return { ...day, enabled: false };
        })
      );
    }
  }, [spiral]);

  // ✅ Handle toggle
  const handleDayToggle = (dayNumber: number) => {
    setDays((prev) =>
      prev.map((day) =>
        day.day_number === dayNumber ? { ...day, enabled: !day.enabled } : day
      )
    );
  };

  // ✅ Handle journal or voice title change
  const handleFieldChange = (
    dayNumber: number,
    field: "journalPrompt" | "voiceTitle",
    value: string
  ) => {
    setDays((prev) =>
      prev.map((day) =>
        day.day_number === dayNumber ? { ...day, [field]: value } : day
      )
    );
  };

  // ✅ Handle voice file upload
  const handleVoiceUpload = (dayNumber: number, file: File | null) => {
    setDays((prev) =>
      prev.map((day) =>
        day.day_number === dayNumber ? { ...day, voiceFile: file } : day
      )
    );
  };

  // ✅ Update single day
  const handleUpdateDay = async (day: DayData) => {
    if (!day.id) {
      console.warn("Day ID missing, cannot update.");
      return;
    }

    const formData = new FormData();
    formData.append("journal_prompt", day.journalPrompt);
    formData.append("voice_title", day.voiceTitle);
    if (day.voiceFile) formData.append("voice_drop", day.voiceFile);

    try {
      await updateDay({ id: day.id, data: formData }).unwrap();
      alert(`✅ Day ${day.day_number} updated successfully`);
    } catch (err) {
      console.error("Failed to update:", err);
      alert(`❌ Failed to update Day ${day.day_number}`);
    }
  };

  // ✅ Update all active days
  const handleUpdateAll = async () => {
    for (const day of days.filter((d) => d.enabled)) {
      await handleUpdateDay(day);
    }
    router.push("/spiral-management");
  };

  if (isLoading)
    return (
      <div className='space-y-6'>
        <Skeleton className='h-96 w-full mx-auto bg-gray-200' />
        <Skeleton className='h-64 w-full bg-gray-200' />
      </div>
    );

  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-6'>
      <div className='container mx-auto'>
        {/* Header */}
        <div className='flex items-center gap-4 mb-8'>
          <Link
            href='/spiral-management'
            className='flex items-center text-gray-900'
          >
            <Button variant='ghost' size='sm' onClick={() => router.back()}>
              <ArrowLeft className='w-4 h-4 mr-2' />
            </Button>
            Edit Spiral
          </Link>
        </div>

        {/* Days Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {days.map((day) => (
            <Card
              key={day.day_number}
              className={`${
                day.enabled ? "border-blue-300" : "border-gray-200 opacity-60"
              }`}
            >
              <CardContent className='p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-lg font-semibold'>
                    Day {day.day_number}
                  </h3>
                  <Switch
                    checked={day.enabled}
                    onCheckedChange={() => handleDayToggle(day.day_number)}
                  />
                </div>

                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Voice Title:
                    </label>
                    <Input
                      placeholder='Enter voice title'
                      value={day.voiceTitle}
                      onChange={(e) =>
                        handleFieldChange(
                          day.day_number,
                          "voiceTitle",
                          e.target.value
                        )
                      }
                      disabled={!day.enabled}
                      className='!border border-gray-400'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Journal Prompt:
                    </label>
                    <Textarea
                      placeholder='Enter journal prompt'
                      value={day.journalPrompt}
                      onChange={(e) =>
                        handleFieldChange(
                          day.day_number,
                          "journalPrompt",
                          e.target.value
                        )
                      }
                      disabled={!day.enabled}
                      rows={3}
                      className='!border border-gray-400'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Voice Drop:
                    </label>
                    <div className='!w-full bg-[#F4F4F4] flex items-center gap-2'>
                      <Input
                        type='file'
                        accept='audio/*'
                        onChange={(e) =>
                          handleVoiceUpload(
                            day.day_number,
                            e.target.files?.[0] || null
                          )
                        }
                        disabled={!day.enabled}
                        className='hidden'
                        id={`voice-upload-${day.day_number}`}
                      />
                      <label
                        htmlFor={`voice-upload-${day.day_number}`}
                        className={`flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 ${
                          !day.enabled ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <Upload className='w-4 h-4' />
                        <span className='text-sm'>
                          {day.voiceFile
                            ? day.voiceFile.name
                            : day.voiceDrop
                            ? day.voiceDrop.split("/").pop()
                            : "Upload audio file"}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>

              <div className='flex items-center justify-end gap-4 px-6 pb-4'>
                <Button
                  className='bg-transparent hover:bg-transparent text-[#FEAA39] border border-[#FEAA39]'
                  onClick={() => router.push("/spiral-management")}
                >
                  Cancel
                </Button>
                <Button
                  className='bg-[#FEAA39] hover:bg-[#e98f1a] text-white'
                  onClick={() => handleUpdateDay(day)}
                  disabled={!day.enabled}
                >
                  Update
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Update All Button */}
        <div className='flex justify-end mt-8'>
          <Button
            className='bg-blue-600 hover:bg-blue-700 text-white px-6'
            onClick={handleUpdateAll}
          >
            Update All Active Days
          </Button>
        </div>
      </div>
    </div>
  );
}
